import React, { useEffect, useState } from 'react';
import { SafeAreaView, TextInput, Text, StyleSheet, TouchableOpacity, View, Image, Modal, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from "../../assets/colors/theme";
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [photo, setPhoto] = useState({ uri: user?.photo || '' });
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { logOutUser, deleteUser } = useAuth();

  useEffect(() => {
    console.log("Logging user from profile", user);
  }, [user]);

  const handleSave = async () => {
    const updatedUser = {
      firstName,
      lastName,
      email,
      phone,
    };
  
    try {
      await updateUser(updatedUser);
      setModalContent({ title: 'Profile Updated', message: 'Your profile has been updated successfully.' });
      setModalVisible(true);
      setSaveEnabled(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setModalContent({ title: 'Update Failed', message: 'There was an error updating your profile. Please try again.' });
      setModalVisible(true);
    }
  };

  // const handleChangePhoto = async () => {
  //   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  //   if (permissionResult.granted === false) {
  //     alert("Permission to access camera roll is required!");
  //     return;
  //   }
  
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });
  
  //   if (!result.canceled) {
  //     setPhoto({ uri: result.assets[0].uri });
  //     setSaveEnabled(true);
  //   }
  // };

  const handleLogout = async () => {
    try {
    await logOutUser();
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleChange = () => {
      if (firstName !== user?.firstName || lastName !== user.lastName || email !== user.email || phone !== user.phone) {
        setSaveEnabled(true);
      } else {
        setSaveEnabled(false);
      }
  };

  const handleDeletePress = () => {
    setDeleting(true);
    setConfirmText("");
    setIsConfirmEnabled(false);
    setConfirmModalVisible(true);
  };

  const handleConfirmTextChange = (text: string) => {
    setConfirmText(text);
    setIsConfirmEnabled(text === "DELETE");
  };

  const handleConfirmDelete = async () => {
    setConfirmModalVisible(false);
    try {
      await deleteUser();
      setModalContent({ title: "Profile Deleted", message: "Your profile has been deleted successfully." });
      setModalVisible(true);
    } catch (error) {
      setModalContent({ title: "Error", message: "Failed to delete account. Please try again." });
      setModalVisible(true);
    } finally {
      setDeleting(false)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.main}>
              {/* Profile Picture */}
              <Image source={photo} style={styles.profileImage} />
              {/* <TouchableOpacity>
                  <Text style={styles.changePhoto}>Change photo</Text>
              </TouchableOpacity> */}

              {/* Editable Fields */}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={text => { setFirstName(text); handleChange(); }}
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={text => { setLastName(text); handleChange(); }}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                editable={false}
                style={styles.disabledInput}
                placeholder="Enter your email"
                value={email}
                onChangeText={text => { setEmail(text); handleChange(); }}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={text => { setPhone(text); handleChange(); }}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                  <TextInput
                    editable={false}
                    style={styles.disabledInput}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.text}
                    value={newPassword}
                    onChangeText={text => { setNewPassword(text); handleChange(); }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                      onPress={() => setShowPassword(prev => !prev)}
                      style={styles.eyeIcon}
                  >
                      <Ionicons
                          name={showPassword ? "eye-off" : "eye"}
                          size={24}
                          color="black"
                      />
                  </TouchableOpacity>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                  style={[styles.button, { backgroundColor: saveEnabled ? colors.primary : '#aaa' }]}
                  onPress={handleSave}
                  disabled={!saveEnabled}
              >
                  <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              {/* Log Out Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Image 
                  source={require("../../assets/icons/SignOut.png")}
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>

              {/* Delete Account Button */}
              <TouchableOpacity style={[styles.logoutButton, deleting && {backgroundColor: colors.text}]} onPress={handleDeletePress} disabled={deleting}>
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                  ) : (
                  <Text style={styles.logoutButtonText}>Delete Account</Text>
                )}
              </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal for alerts */}
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{modalContent.title}</Text>
                  <Text style={styles.modalMessage}>{modalContent.message}</Text>
                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setModalVisible(false)}
                  >
                      <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

        <Modal
          visible={confirmModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={[styles.modalMessage,{width:"80%"}]}>
              Type "DELETE" below to confirm the deletion of your account. This action cannot be undone.
            </Text>

            <TextInput
              style={styles.confirmInput}
              placeholder="Type DELETE"
              placeholderTextColor={colors.text}
              onChangeText={handleConfirmTextChange}
              value={confirmText}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: isConfirmEnabled ? "red" : "#aaa", flex:1 }]}
                onPress={handleConfirmDelete}
                disabled={!isConfirmEnabled}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, {flex: 1}]}
                onPress={() => {
                  setDeleting(false);
                  setConfirmModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: "100%",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    alignItems: "center",
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  main: {
    width: "100%",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  changePhoto: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 20,
  },
  label: {
    width: "90%",
    fontSize: 17,
    color: colors.text,
    paddingTop: 8,
    paddingBottom: 5,
  },
  input: {
    height: 40,
    width: '90%',
    backgroundColor: '#fff',
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 20,
    fontWeight: '500',
  },
  disabledInput: {
    height: 40,
    width: '90%',
    backgroundColor: colors.border,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 20,
    fontWeight: '500',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 40,
    top: 8,
  },
  button: {
    display: 'flex',
    width: '90%',
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#ca1f2d',
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: "center",
    textAlign: 'center',
    marginTop: 20,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#fff"
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: '#000',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    width: "90%",
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    width: "90%"
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    width: "90%",
  },
});

export default ProfileScreen;