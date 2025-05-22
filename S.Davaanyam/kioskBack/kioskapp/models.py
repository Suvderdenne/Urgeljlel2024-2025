from django.db import models

# Hereglegch
class User(models.Model):
    uid = models.AutoField(primary_key=True)
    овог = models.CharField(max_length=100)
    нэр = models.CharField(max_length=100)
    утас = models.CharField(max_length=15)
    имэйл = models.EmailField(max_length=255)
    бүртгэсэн_огноо = models.DateTimeField(auto_now_add=True)
    шинэчлэгдсэн_огноо = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.нэр

# Dans model
class Dans(models.Model):
    данс_id = models.AutoField(primary_key=True)
    данс_дугаар = models.CharField(max_length=20, unique=True)
    пин_код = models.CharField(max_length=6)  # ✅ Гүйлгээнд ашиглах тул хадгалсан
    дансны_төрөл = models.CharField(max_length=50, choices=[('SAVINGS', 'Хадгаламж'), ('CURRENT', 'Харилцах')])  # ✅ Сонголт нэмсэн
    үлдэгдэл = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    валют = models.CharField(max_length=10)
    үүсгэсэн_огноо = models.DateTimeField(auto_now_add=True)
    шинэчлэгдсэн_огноо = models.DateTimeField(auto_now=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dansnuud')

    def __str__(self):
        return f"Данс {self.данс_дугаар} ({self.хэрэглэгч.нэр})"


# Guilgee model
class Guilgee(models.Model):
    гүйлгээ_id = models.AutoField(primary_key=True)
    account_from = models.ForeignKey(Dans, related_name='shiljuulegch', on_delete=models.CASCADE)  # Sender account
    account_to = models.ForeignKey(Dans, related_name='huleen_awagch', on_delete=models.CASCADE)  # Receiver account
    гүйлгээний_төрөл = models.CharField(max_length=50, choices=[('TRANSFER', 'Шилжүүлэг'), ('PAYMENT', 'Төлбөр')])
    дүн = models.DecimalField(max_digits=18, decimal_places=2)
    валют = models.CharField(max_length=10)
    гүйлгээний_огноо = models.DateTimeField(auto_now_add=True)
    төлөв = models.CharField(max_length=20, choices=[('PENDING', 'Хүлээгдэж буй'), ('COMPLETED', 'Дууссан'), ('FAILED', 'Амжилтгүй')], default='PENDING')

    def __str__(self):
        return f"Guilgee {self.гүйлгээ_id} from {self.account_from} to {self.account_to} for {self.дүн} {self.валют}"



# Card model
class Card(models.Model):
    картid = models.AutoField(primary_key=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cards')
    данс = models.ForeignKey(Dans, on_delete=models.CASCADE, related_name='cards')
    карт_дугаар = models.CharField(max_length=16)
    карт_төрөл = models.CharField(max_length=20)
    дуусах_хугацаа = models.DateField()
    пин_код = models.CharField(max_length=4)
    төлөв = models.CharField(max_length=20)

    def __str__(self):
        return f"Card {self.картid} for {self.хэрэглэгч}"

#Tulburiin Medeelel model
class TulburiinMedeelel(models.Model):
    төлбөрМэд_id = models.AutoField(primary_key=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tulburiin_medeelel')
    данс = models.ForeignKey(Dans, on_delete=models.CASCADE, related_name='tulburiin_medeelel')
    төлбөрийн_төрөл = models.CharField(max_length=50)
    дүн = models.DecimalField(max_digits=18, decimal_places=2)
    төлөв = models.CharField(max_length=20)
    төлбөр_хийгдсэн_огноо = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tulburiin Medeelel {self.төлбөрМэд_id} for {self.хэрэглэгч}"

# Kiosk model
class KioskDevice(models.Model):
    киоск_id = models.AutoField(primary_key=True)
    байршил = models.CharField(max_length=255)
    төлөв = models.CharField(max_length=20)
    дэмжигдсэн_валют = models.TextField()
    сүүлийн_засвар = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Kiosk {self.киоск_id} located at {self.байршил}"

# QR/NFC Payment model
class QRNfcPayment(models.Model):
    id = models.AutoField(primary_key=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='qr_nfc_payments')
    данс = models.ForeignKey(Dans, on_delete=models.CASCADE, related_name='qr_nfc_payments')
    төлбөрийн_арга = models.CharField(max_length=20)
    дүн = models.DecimalField(max_digits=18, decimal_places=2)
    худалдааны_байгууллага = models.CharField(max_length=255)
    төлөв = models.CharField(max_length=20)
    гүйлгээний_огноо = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QR NFC Payment {self.id} for {self.хэрэглэгч}"

# Savings model
class Hadgalamj(models.Model):
    хадгаламж_id = models.AutoField(primary_key=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='savings')
    данс = models.ForeignKey(Dans, on_delete=models.CASCADE, related_name='savings')
    хадгаламж_төрөл = models.CharField(max_length=50)
    хүү = models.DecimalField(max_digits=5, decimal_places=2)
    эхлэх_огноо = models.DateTimeField(auto_now_add=True)
    дуусах_огноо = models.DateTimeField()
    төлөв = models.CharField(max_length=20)

    def __str__(self):
        return f"Hadgalamj {self.хадгаламж_id} for {self.хэрэглэгч}"

# Loan model
class Zeel(models.Model):
    id = models.AutoField(primary_key=True)
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans')
    данс = models.ForeignKey(Dans, on_delete=models.CASCADE, related_name='loans')
    зээлийн_төрөл = models.CharField(max_length=50)
    зээлийн_дүн = models.DecimalField(max_digits=18, decimal_places=2)
    хүү = models.DecimalField(max_digits=5, decimal_places=2)
    төлөх_хугацаа = models.DateField()
    төлөв = models.CharField(max_length=20)

    def __str__(self):
        return f"Zeel {self.id} for {self.хэрэглэгч}"

# Kiosk Session model
class KioskSession(models.Model):
    sessionid = models.AutoField(primary_key=True)
    киоск = models.ForeignKey(KioskDevice, on_delete=models.CASCADE, related_name='sessions')
    хэрэглэгч = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kiosk_sessions')
    үйлдэл = models.CharField(max_length=255)
    үйлдлийн_огноо = models.DateTimeField(auto_now_add=True)
    төлөв = models.CharField(max_length=20)

    def __str__(self):
        return f"Kiosk Session {self.sessionid} for {self.хэрэглэгч}"

# Fee model
class Huraamj(models.Model):
    хураамжid = models.AutoField(primary_key=True)
    гүйлгээ = models.ForeignKey(Guilgee, on_delete=models.CASCADE, related_name='fees')
    хураамж_төрөл = models.CharField(max_length=50, choices=[('TRANSFER_FEE', 'Шилжүүлгийн хураамж'), ('PAYMENT_FEE', 'Төлбөрийн хураамж')])  # ✅ Сонголт нэмсэн
    хураамж_дүн = models.DecimalField(max_digits=18, decimal_places=2)  # ✅ "хураамж_дүү" -> "хураамж_дүн" гэж зассан
    валют = models.CharField(max_length=10)
    төлөв = models.CharField(max_length=20, choices=[('PENDING', 'Хүлээгдэж буй'), ('PAID', 'Төлөгдсөн')], default='PENDING')

    def __str__(self):
        return f"Huraamj {self.хураамжid} for Guilgee {self.гүйлгээ}"
