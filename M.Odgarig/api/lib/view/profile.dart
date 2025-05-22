import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _name = "Одгариг";
  String _email = "odkomonhbayr@gmail.com";
  String _phoneNumber = "99119911";
  String _school = "12-р сургууль";
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;
  bool _examReminders = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage('https://i.pinimg.com/736x/2c/43/ea/2c43eaba2fa106786b6496aba9fcf1ba.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildProfileHeader(),
              SizedBox(height: 24),
              _buildSectionTitle("Хувийн мэдээлэл"),
              _buildProfileItem(
                icon: Icons.person,
                title: "Нэр",
                value: _name,
                onTap: () => _showEditDialog("Нэр", _name, (value) {
                  setState(() {
                    _name = value;
                  });
                }),
              ),
              _buildProfileItem(
                icon: Icons.email,
                title: "Имэйл",
                value: _email,
                onTap: () => _showEditDialog("Имэйл", _email, (value) {
                  setState(() {
                    _email = value;
                  });
                }),
              ),
              _buildProfileItem(
                icon: Icons.phone,
                title: "Утасны дугаар",
                value: _phoneNumber,
                onTap: () => _showEditDialog("Утасны дугаар", _phoneNumber, (value) {
                  setState(() {
                    _phoneNumber = value;
                  });
                }),
              ),
              _buildProfileItem(
                icon: Icons.school,
                title: "Сургууль",
                value: _school,
                onTap: () => _showEditDialog("Сургууль", _school, (value) {
                  setState(() {
                    _school = value;
                  });
                }),
              ),
              SizedBox(height: 24),
              _buildSectionTitle("Тохиргоо"),
              _buildSwitchItem(
                icon: Icons.notifications,
                title: "Мэдэгдэл",
                value: _notificationsEnabled,
                onChanged: (value) {
                  setState(() {
                    _notificationsEnabled = value;
                  });
                },
              ),
              _buildSwitchItem(
                icon: Icons.calendar_today,
                title: "Шалгалтын эргэн санах",
                value: _examReminders,
                onChanged: (value) {
                  setState(() {
                    _examReminders = value;
                  });
                },
              ),
              _buildSwitchItem(
                icon: Icons.dark_mode,
                title: "Харанхуй горим",
                value: _darkModeEnabled,
                onChanged: (value) {
                  setState(() {
                    _darkModeEnabled = value;
                  });
                },
              ),
              SizedBox(height: 24),
              _buildSectionTitle("Систем"),
              _buildProfileItem(
                icon: Icons.help,
                title: "Тусламж",
                value: "",
                onTap: () {},
              ),
              _buildProfileItem(
                icon: Icons.info,
                title: "Бидний тухай",
                value: "",
                onTap: () {},
              ),
              _buildProfileItem(
                icon: Icons.star,
                title: "Үнэлгээ өгөх",
                value: "",
                onTap: () {},
              ),
              SizedBox(height: 32),
              Center(
                child: ElevatedButton(
                  onPressed: () {
                    // Гарах логик
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                    elevation: 5,
                    shadowColor: Colors.deepPurple.withOpacity(0.4),
                  ),
                  child: Text(
                    "Гарах",
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Center(
      child: Column(
        children: [
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              CircleAvatar(
                radius: 50,
                backgroundImage: AssetImage('assets/profile_placeholder.png'),
                backgroundColor: Colors.deepPurple[100],
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.deepPurple,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: IconButton(
                  icon: Icon(Icons.camera_alt, size: 20, color: Colors.white),
                  onPressed: () {
                    // Зураг солих функц
                  },
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          Text(
            _name,
            style: TextStyle(
              fontSize: 24, 
              fontWeight: FontWeight.bold,
              color: Colors.deepPurple,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.deepPurple[800],
        ),
      ),
    );
  }

  Widget _buildProfileItem({
    required IconData icon,
    required String title,
    required String value,
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      margin: EdgeInsets.symmetric(vertical: 4),
      child: ListTile(
        leading: Icon(icon, color: Colors.deepPurple),
        title: Text(
          title,
          style: TextStyle(
            color: Colors.deepPurple.shade900,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: value.isNotEmpty ? Text(value) : null,
        trailing: onTap != null ? Icon(Icons.chevron_right, color: Colors.deepPurple) : null,
        onTap: onTap,
      ),
    );
  }

  Widget _buildSwitchItem({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      margin: EdgeInsets.symmetric(vertical: 4),
      child: ListTile(
        leading: Icon(icon, color: Colors.deepPurple),
        title: Text(
          title,
          style: TextStyle(
            color: Colors.deepPurple.shade900,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeColor: Colors.deepPurple,
        ),
      ),
    );
  }

  void _showEditDialog(
    String field,
    String currentValue,
    ValueChanged<String> onSave,
  ) {
    TextEditingController controller = TextEditingController(
      text: currentValue,
    );

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            "$field өөрчлөх",
            style: TextStyle(color: Colors.deepPurple),
          ),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(
              labelText: field,
              labelStyle: TextStyle(
                color: Colors.deepPurple.shade600,
                fontWeight: FontWeight.w500,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.deepPurple.shade200),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.deepPurple.shade200),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.deepPurple, width: 1.5),
              ),
              filled: true,
              fillColor: Colors.white.withOpacity(0.9),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                "Болих",
                style: TextStyle(color: Colors.deepPurple.shade600),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                onSave(controller.text);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
              ),
              child: Text(
                "Хадгалах",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }
}