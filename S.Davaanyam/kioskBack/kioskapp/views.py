from email.message import EmailMessage
from io import BytesIO
from tkinter import Canvas
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Dans, Guilgee, Hadgalamj, Huraamj, User
import json
from django.db import transaction
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST, require_GET
from decimal import Decimal
from django.db.models import Q
from datetime import datetime

@csrf_exempt
def kiosk_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            данс_дугаар = data.get("данс_дугаар")
            пин_код = data.get("пин_код")

            account = Dans.objects.filter(данс_дугаар=данс_дугаар, пин_код=пин_код).first()
            
            if account:
                # Save session info
                request.session['user_id'] = account.хэрэглэгч.uid
                request.session['account_id'] = account.данс_id
                request.session['account_number'] = account.данс_дугаар

                return JsonResponse({
                    "success": True,
                    "message": "Амжилттай нэвтэрлээ!",
                    "user": {
                        "нэр": account.хэрэглэгч.нэр,
                        "овог": account.хэрэглэгч.овог,
                        "утас": account.хэрэглэгч.утас,
                        "данс": account.данс_дугаар,
                        "үлдэгдэл": str(account.үлдэгдэл),
                        "валют": account.валют,
                    }
                }, status=200)

            return JsonResponse({"success": False, "message": "Дансны дугаар эсвэл ПИН код буруу байна!"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Алдаатай өгөгдөл!"}, status=400)

    return JsonResponse({"success": False, "message": "POST хүсэлт илгээх шаардлагатай!"}, status=405)

#logout
@csrf_exempt
def kiosk_logout(request):
    if request.method == "POST":
        try:
            # Session-г устгах
            request.session.flush()  # бүх session-ийг устгах

            return JsonResponse({
                "success": True,
                "message": "Амжилттай гарлаа!"
            }, status=200)

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Алдаа гарлаа: {str(e)}"}, status=500)

    return JsonResponse({"success": False, "message": "POST хүсэлт илгээх шаардлагатай!"}, status=405)



@csrf_exempt
@require_POST
def guilgee_view(request):
    try:
        if not request.session.get("user_id"):
            return JsonResponse({"error": "Нэвтрэх шаардлагатай"}, status=401)

        data = json.loads(request.body)

        from_account_id = request.session.get("account_id")  # session-аас авах
        to_account_number = data.get("данс_дугаар")  # хүлээн авагчийн дансны дугаар
        amount = Decimal(str(data.get("дүн", "0")))
        currency = data.get("валют")
        trans_type = data.get("гүйлгээний_төрөл", "TRANSFER")
        fee_amount = Decimal(str(data.get("хураамж_дүн", "0")))

        if not all([from_account_id, to_account_number, amount, currency]):
            return JsonResponse({"error": "Бүх шаардлагатай утгуудыг оруулна уу"}, status=400)

        with transaction.atomic():
            from_account = Dans.objects.select_for_update().get(данс_id=from_account_id)
            to_account = Dans.objects.select_for_update().get(данс_дугаар=to_account_number)

            if from_account.валют != currency or to_account.валют != currency:
                return JsonResponse({"error": "Дансны валют тохирохгүй байна"}, status=400)

            if from_account.үлдэгдэл < amount + fee_amount:
                return JsonResponse({"error": "Үлдэгдэл хүрэлцэхгүй байна"}, status=400)

            from_account.үлдэгдэл -= (amount + fee_amount)
            to_account.үлдэгдэл += amount
            from_account.save()
            to_account.save()

            guilgee = Guilgee.objects.create(
                account_from=from_account,
                account_to=to_account,
                гүйлгээний_төрөл=trans_type,
                дүн=amount,
                валют=currency,
                төлөв='COMPLETED'
            )

            if fee_amount > 0:
                Huraamj.objects.create(
                    гүйлгээ=guilgee,
                    хураамж_төрөл='TRANSFER_FEE' if trans_type == 'TRANSFER' else 'PAYMENT_FEE',
                    хураамж_дүн=fee_amount,
                    валют=currency,
                    төлөв='PAID'
                )

            # Retrieve the recipient's name and surname
            recipient_name = to_account.хэрэглэгч.нэр if hasattr(to_account, 'хэрэглэгч') else "Нэр тодорхойгүй"
            recipient_surname = to_account.хэрэглэгч.овог if hasattr(to_account, 'хэрэглэгч') else "Овог тодорхойгүй"

            return JsonResponse({
                "message": "Гүйлгээ амжилттай",
                "гүйлгээ_id": guilgee.гүйлгээ_id,
                "recipient_name": recipient_name,
                "recipient_surname": recipient_surname
            }, status=201)

    except Dans.DoesNotExist:
        return JsonResponse({"error": "Данс олдсонгүй"}, status=404)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Системийн алдаа: {str(e)}"}, status=500)




@csrf_exempt
def kiosk_orlogo(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            account_id = data.get('account_id')
            amount = data.get('amount')
            currency = data.get('currency')

            if not all([account_id, amount, currency]):
                return JsonResponse({'error': 'Бүх талбарууд шаардлагатай.'}, status=400)

            dans = Dans.objects.get(pk=account_id)
            amount_decimal = Decimal(str(amount))
            dans.үлдэгдэл += amount_decimal
            dans.save()

            # ✅ Гүйлгээ хадгалах
            Guilgee.objects.create(
                account_from=dans,
                account_to=dans,  # өөрийн данс руу орж байгаа гэж үзнэ
                гүйлгээний_төрөл='ОРЛОГО',
                дүн=amount_decimal,
                валют=currency,
                төлөв='COMPLETED'
            )

            return JsonResponse({
                'success': True,
                'message': 'Бэлэн мөнгө амжилттай нэмэгдлээ.',
                'updated_balance': str(dans.үлдэгдэл)
            })

        except Dans.DoesNotExist:
            return JsonResponse({'error': 'Данс олдсонгүй.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'POST хүсэлт шаардлагатай.'}, status=405)


@csrf_exempt
def kiosk_zarlaga(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            account_id = data.get('account_id')
            amount = data.get('amount')
            currency = data.get('currency')

            if not all([account_id, amount, currency]):
                return JsonResponse({'error': 'Бүх талбарууд шаардлагатай.'}, status=400)

            dans = Dans.objects.get(pk=account_id)
            amount_decimal = Decimal(str(amount))

            # ✅ Шалгах: хангалттай үлдэгдэл байна уу?
            if dans.үлдэгдэл < amount_decimal:
                return JsonResponse({'error': 'Үлдэгдэл хүрэлцэхгүй байна.'}, status=400)

            # ✅ Зарлага хасах
            dans.үлдэгдэл -= amount_decimal
            dans.save()

            # ✅ Гүйлгээ бүртгэх
            Guilgee.objects.create(
                account_from=dans,
                account_to=dans,
                гүйлгээний_төрөл='ЗАРЛАГА',
                дүн=amount_decimal,
                валют=currency,
                төлөв='COMPLETED'
            )

            return JsonResponse({
                'success': True,
                'message': 'Бэлэн мөнгө амжилттай авлаа.',
                'updated_balance': str(dans.үлдэгдэл)
            })

        except Dans.DoesNotExist:
            return JsonResponse({'error': 'Данс олдсонгүй.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'POST хүсэлт шаардлагатай.'}, status=405)

#verify
@csrf_exempt
def verify_session(request):
    if not request.session.get('user_id'):
        return JsonResponse({'valid': False}, status=401)
    return JsonResponse({
        'valid': True,
        'user_id': request.session['user_id'],
        'account_id': request.session['account_id']
    })

# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.db.models import Q
# from datetime import datetime
# import json

# @csrf_exempt
# def kiosk_khuulga(request):
#     # Check if user is logged in via session
#     if 'user_id' not in request.session or 'account_id' not in request.session:
#         return JsonResponse({"success": False, "message": "Нэвтэрнэ үү!"}, status=401)
    
#     if request.method == "GET":
#         try:
#             account_id = request.session['account_id']
#             account = Dans.objects.get(данс_id=account_id)
            
#             # Get filter parameters from request
#             start_date_str = request.GET.get('start_date')
#             end_date_str = request.GET.get('end_date')
#             transaction_type = request.GET.get('transaction_type')
            
#             # Base query for transactions related to this account (No ordering)
#             transactions = Guilgee.objects.filter(
#                 Q(account_from=account) | Q(account_to=account)
#             )
            
#             # Apply date filters if provided
#             if start_date_str and end_date_str:
#                 try:
#                     start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
#                     end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
#                     transactions = transactions.filter(
#                         гүйлгээний_огноо__date__gte=start_date,
#                         гүйлгээний_огноо__date__lte=end_date
#                     )
#                 except ValueError:
#                     return JsonResponse({"success": False, "message": "Огнооны формат буруу! (YYYY-MM-DD)"}, status=400)
            
#             # Apply transaction type filter if provided
#             if transaction_type:
#                 transactions = transactions.filter(гүйлгээний_төрөл=transaction_type)
            
#             # Prepare transaction data for response
#             statement = []
#             for t in transactions:
#                 is_outgoing = t.account_from == account
#                 related_account = t.account_to if is_outgoing else t.account_from
                
#                 statement.append({
#                     "гүйлгээ_id": t.гүйлгээ_id,
#                     "огноо": t.гүйлгээний_огноо.strftime('%Y-%m-%d %H:%M:%S'),
#                     "төрөл": t.гүйлгээний_төрөл,
#                     "дүн": str(t.дүн),
#                     "валют": t.валют,
#                     "чиглэл": "Илгээсэн" if is_outgoing else "Хүлээн авсан",
#                     "харилцах_данс": related_account.данс_дугаар,
#                     "төлөв": t.төлөв,
#                     "үлдэгдэл_өөрчлөлт": str(t.дүн * (-1 if is_outgoing else 1))
#                 })
            
#             return JsonResponse({
#                 "success": True,
#                 "statement": statement,
#                 "account_info": {
#                     "данс_дугаар": account.данс_дугаар,
#                     "үлдэгдэл": str(account.үлдэгдэл),
#                     "валют": account.валют,
#                     "хугацааны_загвар": "YYYY-MM-DD"
#                 }
#             })
            
#         except Dans.DoesNotExist:
#             return JsonResponse({"success": False, "message": "Данс олдсонгүй!"}, status=404)
#         except Exception as e:
#             return JsonResponse({"success": False, "message": str(e)}, status=500)
    
#     return JsonResponse({"success": False, "message": "GET хүсэлт илгээх шаардлагатай!"}, status=405)

# views.py
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.utils.dateparse import parse_date
# from django.db.models import Q

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def kiosk_khuulga(request):
#     user = request.user
#     start_date = parse_date(request.GET.get('start_date'))
#     end_date = parse_date(request.GET.get('end_date'))
#     transaction_type = request.GET.get('transaction_type')

#     from .models import Данснууд, Гүйлгээ  # Adjust to your app name

#     account = Данснууд.objects.filter(хэрэглэгч=user).first()
#     if not account:
#         return Response({'success': False, 'message': 'Данс олдсонгүй'})

#     queryset = Гүйлгээ.objects.filter(данс=account)
#     if start_date:
#         queryset = queryset.filter(гүйлгээний_огноо__gte=start_date)
#     if end_date:
#         queryset = queryset.filter(гүйлгээний_огноо__lte=end_date)
#     if transaction_type:
#         queryset = queryset.filter(гүйлгээний_төрөл=transaction_type)

#     statement = []
#     for tx in queryset.order_by('-гүйлгээний_огноо'):
#         statement.append({
#             "гүйлгээ_id": tx.id,
#             "огноо": tx.гүйлгээний_огноо.strftime("%Y-%m-%d"),
#             "төрөл": tx.гүйлгээний_төрөл,
#             "дүн": str(tx.дүн),
#             "валют": tx.валют,
#             "чиглэл": "Гадагш" if tx.дүн < 0 else "Дотогш",
#             "харилцах_данс": "Бусад",  # Change if you store counterparty info
#             "төлөв": tx.төлөв,
#             "үлдэгдэл_өөрчлөлт": str(tx.дүн),
#         })

#     return Response({
#         "success": True,
#         "statement": statement,
#         "account_info": {
#             "данс_дугаар": account.id,
#             "үлдэгдэл": str(account.үлдэгдэл),
#             "валют": account.валют,
#             "хугацааны_загвар": f"{start_date} - {end_date}" if start_date and end_date else "",
#         }
#     })

# Khuulga
# @csrf_exempt
# def kiosk_khuulga(request):
#     if 'user_id' not in request.session or 'account_id' not in request.session:
#         return JsonResponse({"success": False, "message": "Нэвтэрнэ үү!"}, status=401)

#     if request.method == "GET":
#         try:
#             account_id = request.session['account_id']
#             account = Dans.objects.get(данс_id=account_id)

#             start_date_str = request.GET.get('start_date')
#             end_date_str = request.GET.get('end_date')
#             transaction_type = request.GET.get('transaction_type')

#             transactions = Guilgee.objects.filter(
#                 Q(account_from=account) | Q(account_to=account)
#             )

#             if start_date_str and end_date_str:
#                 start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
#                 end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
#                 transactions = transactions.filter(
#                     гүйлгээний_огноо__date__gte=start_date,
#                     гүйлгээний_огноо__date__lte=end_date
#                 )

#             if transaction_type:
#                 transactions = transactions.filter(гүйлгээний_төрөл=transaction_type)

#             statement = []
#             for t in transactions:
#                 is_outgoing = t.account_from == account
#                 related_account = t.account_to if is_outgoing else t.account_from
#                 statement.append({
#                     "гүйлгээ_id": t.гүйлгээ_id,
#                     "огноо": t.гүйлгээний_огноо.strftime('%Y-%m-%d %H:%M:%S'),
#                     "төрөл": t.гүйлгээний_төрөл,
#                     "дүн": str(t.дүн),
#                     "валют": t.валют,
#                     "чиглэл": "Илгээсэн" if is_outgoing else "Хүлээн авсан",
#                     "харилцах_данс": related_account.данс_дугаар,
#                     "төлөв": t.төлөв,
#                     "үлдэгдэл_өөрчлөлт": str(t.дүн * (-1 if is_outgoing else 1))
#                 })

#             return JsonResponse({
#                 "success": True,
#                 "statement": statement,
#                 "account_info": {
#                     "данс_дугаар": account.данс_дугаар,
#                     "үлдэгдэл": str(account.үлдэгдэл),
#                     "валют": account.валют,
#                     "хугацааны_загвар": "YYYY-MM-DD"
#                 }
#             })
#         except Dans.DoesNotExist:
#             return JsonResponse({"success": False, "message": "Данс олдсонгүй!"}, status=404)
#         except Exception as e:
#             return JsonResponse({"success": False, "message": str(e)}, status=500)

#     return JsonResponse({"success": False, "message": "GET хүсэлт илгээх шаардлагатай!"}, status=405)

# Dansnii uldegdel
@csrf_exempt
def kiosk_dansuldegdel(request):
    if 'user_id' not in request.session or 'account_id' not in request.session:
        return JsonResponse({"success": False, "message": "Нэвтэрнэ үү!"}, status=401)

    try:
        account_id = request.session['account_id']
        user_id = request.session['user_id']

        account = Dans.objects.get(данс_id=account_id)
        user = User.objects.get(uid=user_id)

        return JsonResponse({
            "success": True,
            "account_info": {
                "данс_дугаар": account.данс_дугаар,
                "үлдэгдэл": str(account.үлдэгдэл),
                "валют": account.валют,
                "овог": user.овог,
                "нэр": user.нэр,
            }
        })

    except Dans.DoesNotExist:
        return JsonResponse({"success": False, "message": "Данс олдсонгүй!"}, status=404)
    except User.DoesNotExist:
        return JsonResponse({"success": False, "message": "Хэрэглэгч олдсонгүй!"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
    

@csrf_exempt
def kiosk_sendkhuulgapdf(request):
    if 'user_id' not in request.session or 'account_id' not in request.session:
        return JsonResponse({'success': False, 'message': 'Нэвтэрнэ үү!'}, status=401)

    try:
        user_id = request.session['user_id']
        account_id = request.session['account_id']

        user = User.objects.get(uid=user_id)
        account = Dans.objects.get(данс_id=account_id)

        # 1. Generate PDF
        buffer = BytesIO()
        p = Canvas.Canvas(buffer)  # ✅ FIXED
        p.setFont("Helvetica", 12)
        p.drawString(100, 800, "Дансны мэдээлэл:")
        p.drawString(100, 780, f"Нэр: {user.овог} {user.нэр}")
        p.drawString(100, 760, f"Дансны дугаар: {account.данс_дугаар}")
        p.drawString(100, 740, f"Үлдэгдэл: {account.үлдэгдэл} {account.валют}")
        p.save()

        pdf = buffer.getvalue()
        buffer.close()

        # 2. Send email
        email = EmailMessage(
            subject='Таны дансны үлдэгдэл',
            body='Сайн байна уу, таны дансны үлдэгдэл хавсралтаар илгээгдлээ.',
            to=[user.имэйл]
        )
        email.attach('account_balance.pdf', pdf, 'application/pdf')
        email.send()

        return JsonResponse({'success': True, 'message': 'PDF амжилттай илгээгдлээ.'})

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
@require_GET
def recipient_info_view(request):
    account_number = request.GET.get("account_number")

    if not account_number:
        return JsonResponse({"error": "Дансны дугаар оруулна уу"}, status=400)

    try:
        account = Dans.objects.select_related("хэрэглэгч").get(данс_дугаар=account_number)
        return JsonResponse({
            "нэр": account.хэрэглэгч.нэр,
            "овог": account.хэрэглэгч.овог,
        })
    except Dans.DoesNotExist:
        return JsonResponse({
    "message": "Transaction successful",
    "recipient_name": f"{account.хэрэглэгч.овог} {account.хэрэглэгч.нэр}"
})
    

@require_GET
def account_info_view(request):
    account_number = request.GET.get("account_number")
    if not account_number:
        return JsonResponse({"error": "Дансны дугаар байхгүй"}, status=400)
    try:
        account = Dans.objects.select_related("хэрэглэгч").get(данс_дугаар=account_number)
        return JsonResponse({
            "нэр": account.хэрэглэгч.нэр,
            "овог": account.хэрэглэгч.овог,
        })
    except Dans.DoesNotExist:
        return JsonResponse({"error": "Данс олдсонгүй"}, status=404)
    


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from django.db.models import Q
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from .models import Dans, Guilgee

@csrf_exempt
def kiosk_khuulga(request):
    if 'user_id' not in request.session or 'account_id' not in request.session:
        return JsonResponse({"success": False, "message": "Нэвтэрнэ үү!"}, status=401)

    if request.method != "GET":
        return JsonResponse({"success": False, "message": "GET хүсэлт илгээх шаардлагатай!"}, status=405)

    try:
        account_id = request.session['account_id']
        account = Dans.objects.get(данс_id=account_id)

        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        transaction_type = request.GET.get('transaction_type')

        transactions = Guilgee.objects.filter(
            Q(account_from=account) | Q(account_to=account)
        )

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            transactions = transactions.filter(
                гүйлгээний_огноо__date__gte=start_date,
                гүйлгээний_огноо__date__lte=end_date
            )

        if transaction_type:
            transactions = transactions.filter(гүйлгээний_төрөл=transaction_type)

        # Create data list
        statement = []
        for t in transactions:
            is_outgoing = t.account_from == account
            related_account = t.account_to if is_outgoing else t.account_from
            statement.append({
                "гүйлгээ_id": t.гүйлгээ_id,
                "огноо": t.гүйлгээний_огноо.strftime('%Y-%m-%d %H:%M:%S'),
                "төрөл": t.гүйлгээний_төрөл,
                "дүн": str(t.дүн),
                "валют": t.валют,
                "чиглэл": "Илгээсэн" if is_outgoing else "Хүлээн авсан",
                "харилцах_данс": related_account.данс_дугаар,
                "төлөв": t.төлөв,
                "үлдэгдэл_өөрчлөлт": str(t.дүн * (-1 if is_outgoing else 1))
            })

        # 📨 If sending email
        if request.GET.get('send_email') == 'true':
            buffer = BytesIO()
            p = canvas.Canvas(buffer)
            p.drawString(100, 800, f"Дансны хуулга: {account.данс_дугаар}")
            y = 760
            for tx in statement[:30]:  # Limit for height
                p.drawString(100, y, f"{tx['огноо']} | {tx['чиглэл']} | {tx['дүн']} {tx['валют']}")
                y -= 20
            p.showPage()
            p.save()
            buffer.seek(0)

            email = EmailMessage(
                subject="Таны дансны хуулга",
                body="Та хавсралтаас хуулгаа шалгана уу.",
                to=[account.хэрэглэгч.имэйл],  # assuming email field is `имэйл`
            )
            email.attach('khuulga.pdf', buffer.read(), 'application/pdf')
            email.send()

            return JsonResponse({"success": True, "message": "И-мэйл амжилттай илгээгдлээ."})

        # ✅ Otherwise, return as JSON
        return JsonResponse({
            "success": True,
            "statement": statement,
            "account_info": {
                "данс_дугаар": account.данс_дугаар,
                "үлдэгдэл": str(account.үлдэгдэл),
                "валют": account.валют,
                "хугацааны_загвар": "YYYY-MM-DD"
            }
        })

    except Dans.DoesNotExist:
        return JsonResponse({"success": False, "message": "Данс олдсонгүй!"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "message": f"Серверийн алдаа: {str(e)}"}, status=500)


from decimal import Decimal
from datetime import datetime
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def create_savings_account(request):
    if request.method == "POST":
        user_id = request.session.get("user_id")
        if not user_id:
            return JsonResponse({"success": False, "message": "Нэвтрэх шаардлагатай!"}, status=401)

        try:
            data = json.loads(request.body)
            хадгаламж_төрөл = data.get("хадгаламж_төрөл")
            дуусах_огноо = data.get("дуусах_огноо")
            дүн = Decimal(data.get("дүн", "0"))  # хадгаламжийн дүн

            if not (хадгаламж_төрөл and дуусах_огноо and дүн > 0):
                return JsonResponse({"success": False, "message": "Бүх талбарыг зөв оруулна уу!"}, status=400)

            хэрэглэгч = User.objects.filter(uid=user_id).first()
            if not хэрэглэгч:
                return JsonResponse({"success": False, "message": "Хэрэглэгч олдсонгүй!"}, status=404)

            данс = Dans.objects.filter(хэрэглэгч=хэрэглэгч).first()
            if not данс:
                return JsonResponse({"success": False, "message": "Хэрэглэгчид данс бүртгэлгүй байна!"}, status=404)

            # 🧠 Хүүг автоматаар тооцоолох
            хүү = None
            if хадгаламж_төрөл == "Хугацаатай хадгаламж":
                эхлэх_огноо = timezone.now().date()
                дуусах_он = datetime.strptime(дуусах_огноо, "%Y-%m-%d").date().year
                ялгаа = дуусах_он - эхлэх_огноо.year

                if ялгаа == 1:
                    хүү = "12.20"
                elif ялгаа == 2:
                    хүү = "12.25"
                elif ялгаа == 5:
                    хүү = "12.30"
                else:
                    return JsonResponse({"success": False, "message": "Зөвшөөрөгдсөн хугацаа биш байна!"}, status=400)

            elif хадгаламж_төрөл == "Энгийн хугацаагүй":
                if дүн <= Decimal("30000000"):
                    хүү = "4.80"
                else:
                    хүү = "6.80"
            else:
                return JsonResponse({"success": False, "message": "Буруу хадгаламжийн төрөл!"}, status=400)

            Hadgalamj.objects.create(
                хэрэглэгч=хэрэглэгч,
                данс=данс,
                хадгаламж_төрөл=хадгаламж_төрөл,
                хүү=хүү,
                эхлэх_огноо=timezone.now().date(),
                дуусах_огноо=дуусах_огноо,
                төлөв="ИДЭВХТЭЙ"
            )

            return JsonResponse({"success": True, "message": "Хадгаламж амжилттай үүсгэгдлээ!", "хүү": хүү}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "JSON формат алдаатай байна!"}, status=400)

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Серверийн алдаа: {str(e)}"}, status=500)

    return JsonResponse({"success": False, "message": "POST хүсэлт шаардлагатай!"}, status=405)