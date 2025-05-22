from django.shortcuts import render
from datetime import datetime
from django.http import JsonResponse, HttpResponse
import json
from backend.settings import *
from django.views.decorators.csrf import csrf_exempt


def gettime(request):
    jsons = json.loads(request.body)
    action = jsons['action']

    today = datetime.now()
    data = [{'datetime':today}]
    resp = sendResponse(request, 200, data, action)
    return resp


def dt_register(request):
    jsons = json.loads(request.body)
    action = jsons['action']
    firstname = jsons['firstname']
    email = jsons['email']
    passw = jsons['passw']

    myCon = connectDB()
    cursor = myCon.cursor()
    
    query = F"""SELECT COUNT(*) AS usercount FROM t_user 
            WHERE email = '{email}' AND enabled = TRUE"""
    
    cursor.execute(query)
    columns = cursor.description
    respRow = [{columns[index][0]:column for index, 
        column in enumerate(value)} for value in cursor.fetchall()]
    cursor.close()

    if respRow[0]['usercount'] == 1:
        data = [{'email':email}]
        resp = sendResponse(request, 1000, data, action)
    else:
        token = generateStr(12)
        query = F"""INSERT INTO public.t_user(
	email, firstname, passw, regdate, enabled, token, tokendate)
	VALUES ('{email}', '{firstname}', '{passw}'
    , NOW(), FALSE, '{token}', NOW() + interval \'1 day\');
    """
        cursor1 = myCon.cursor()
        cursor1.execute(query)
        myCon.commit()
        cursor1.close()
        data = [{'email':email, 'firstname':firstname}]
        resp = sendResponse(request, 1001, data, action)
        

        sendMail(email, "Verify your email", F"""
                <html>
                <body>
                    <p>SECCESFULLY SIGNED UP. CONFIRM THROUGH THIS LINK. </p>
                    <p> <a href="http://localhost:8001/check/?token={token}">Batalgaajuulalt</a> </p>
                </body>
                </html>
                """)

    return resp


def dt_login(request):
    jsons = json.loads(request.body)
    action = jsons['action']
    email = jsons['email']
    passw = jsons['passw']



    myCon = connectDB()
    cursor = myCon.cursor()
    
    query = F"""SELECT COUNT(*) AS usercount FROM t_user 
            WHERE email = '{email}' AND enabled = TRUE AND passw = '{passw}'"""
    
    cursor.execute(query)
    columns = cursor.description
    respRow = [{columns[index][0]:column for index, 
        column in enumerate(value)} for value in cursor.fetchall()]
    cursor.close()

    if respRow[0]['usercount'] == 1:
        myCon = connectDB()
        cursor1 = myCon.cursor()
        
        query = F"""SELECT email, firstname , image
                FROM t_user 
                WHERE email = '{email}' AND enabled = TRUE AND passw = '{passw}'"""
        
        cursor1.execute(query)
        columns = cursor1.description
        respRow = [{columns[index][0]:column for index, 
            column in enumerate(value)} for value in cursor1.fetchall()]
        cursor1.close()
        
        image = respRow[0]['image']
        email = respRow[0]['email']
        firstname = respRow[0]['firstname']

        data = [{'email':email, 'firstname':firstname,'image':image}]
        resp = sendResponse(request, 1002, data, action)
    else:
        data = [{'email':email}]
        resp = sendResponse(request, 1004, data, action)

    return resp


@csrf_exempt
def checkService(request):
    if request.method == "POST":
        try :
            jsons = json.loads(request.body)
        except json.JSONDecodeError:
            

            result = sendResponse(request, 3003, [], "no action")
            return JsonResponse(json.loads(result))
        action = jsons['action']

        if action == 'gettime':
            result = gettime(request)
            return JsonResponse(json.loads(result))
        elif action == 'register':
            result = dt_register(request)
            return JsonResponse(json.loads(result))
        elif action == 'login':
            result = dt_login(request)
            return JsonResponse(json.loads(result))
        elif action == 'progress':
            result = dt_progress(request)
            return JsonResponse(json.loads(result))
        elif action == 'update_profile':
            result = dt_update(request)
            return JsonResponse(json.loads(result))
        else:
            result = sendResponse(request, 3001, [], action)
            return JsonResponse(json.loads(result))
    else:
        result = sendResponse(request, 3002, [], "no action")
        return JsonResponse(json.loads(result))

def dt_update(request):
    jsons = json.loads(request.body)
    action = jsons['action']
    firstname = jsons.get('firstname')  # Using get() to handle optional fields
    email = jsons['email']
    passw = jsons.get('passw')  
    image = jsons.get('image')

    myCon = connectDB()
    cursor = myCon.cursor()
    
    # First verify the user exists and token is valid
    query = f"""SELECT COUNT(*) AS usercount FROM t_user 
            WHERE email = '{email}'"""
    
    cursor.execute(query)
    columns = cursor.description
    respRow = [{columns[index][0]:column for index, 
        column in enumerate(value)} for value in cursor.fetchall()]
    cursor.close()

    if respRow[0]['usercount'] != 1:
        data = [{'email': email}]
        return sendResponse(request, 1002, data, action)  # Error code for invalid token/user

    # Build the update query dynamically based on provided fields
    update_fields = []
    if firstname:
        update_fields.append(f"firstname = '{firstname}'")
    if passw:
        update_fields.append(f"passw = '{passw}'")
    if image:
        update_fields.append(f"image = '{image}'")
    
    if not update_fields:
        data = [{'email': email}]
        return sendResponse(request, 1003, data, action)  # Error code for no fields to update

    update_query = f"""UPDATE public.t_user
                    SET {', '.join(update_fields)}
                    WHERE email = '{email}';
                    """
    
    cursor1 = myCon.cursor()
    cursor1.execute(update_query)
    myCon.commit()
    cursor1.close()
    
    # Generate new token for security (optional)
    new_token = generateStr(12)
    cursor2 = myCon.cursor()
    cursor2.execute(f"""UPDATE public.t_user
                    SET token = '{new_token}', tokendate = NOW() + interval '1 day'
                    WHERE email = '{email}';
                    """)
    myCon.commit()
    cursor2.close()

    data = [{'email': email, 'firstname': firstname}]
    return sendResponse(request, 1001, data, action)  # Success code for update
@csrf_exempt
def checkToken(request):
    token = request.GET.get('token')
    myCon = connectDB()
    cursor = myCon.cursor()
    
    query = F"""SELECT COUNT(*) AS usertokencount, MIN(email) as email, MAX(firstname) as firstname, 
                    MIN(lastname) AS lastname 
            FROM t_user 
            WHERE token = '{token}' AND enabled = FALSE AND NOW() <= tokendate """
    
    cursor.execute(query)
    columns = cursor.description
    respRow = [{columns[index][0]:column for index, 
        column in enumerate(value)} for value in cursor.fetchall()]
    cursor.close()

    if respRow[0]['usertokencount'] == 1:
        query = F"""UPDATE t_user SET enabled = TRUE WHERE token = '{token}'"""
        cursor1 = myCon.cursor()
        cursor1.execute(query)
        myCon.commit()
        cursor1.close()

        tokenExpired = generateStr(30)
        email = respRow[0]['email']
        firstname = respRow[0]['firstname']
        lastname = respRow[0]['lastname']
        query = F"""UPDATE t_user SET token = '{tokenExpired}', tokendate = NOW() WHERE email = '{email}'"""
        cursor1 = myCon.cursor()
        cursor1.execute(query)
        myCon.commit()
        cursor1.close()
        
        data = [{'email':email, 'firstname':firstname, 'lastname':lastname}]
        resp = sendResponse(request, 1003, data, "verified")
        sendMail(email, "SECCESFUL VERIFICATION",  F"""
                <html>
                <body>
                    <p>SECCESFUL VERIFICATION </p>
                </body>
                </html>
                """)
    else:
        
        data = []
        resp = sendResponse(request, 3004, data, "not verified")
    return JsonResponse(json.loads(resp))
from django.http import JsonResponse
import json

def dt_progress(request):
    json_data = json.loads(request.body)
    action = json_data.get('action')
    email = json_data.get('email')

    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    myCon = connectDB()  
    cursor = myCon.cursor()

    query = f"SELECT lesson1, lesson2, lesson3, lesson4, lesson5 FROM progress WHERE email = '{email}'"

    cursor.execute(query)
    row = cursor.fetchone()  # Assuming there's only one row for each email
    cursor.close()

    if not row:
        return JsonResponse({'error': 'No progress found for this email'}, status=404)

    lesson1, lesson2, lesson3, lesson4, lesson5 = row

    data = {
        'lesson1': lesson1,
        'lesson2': lesson2,
        'lesson3': lesson3,
        'lesson4': lesson4,
        'lesson5': lesson5,
    }

    resp = sendResponse(request, 1002, data, action)  

    return resp

