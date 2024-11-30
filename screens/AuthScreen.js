// AuthScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '651369739698-d8ks70htpqhvdmdqoi14ous78gjmjl4j.apps.googleusercontent.com',
  });

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.navigate('Map'); // Navigate to your Map screen after successful auth
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await promptAsync();
    if (result?.type === 'success') {
      const { id_token } = result.params;
      // Implement Google Sign-In logic here using id_token
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isSignup ? "Sign Up" : "Log In"} onPress={handleSubmit} />
      <Button title={`Switch to ${isSignup ? "Log In" : "Sign Up"}`} onPress={() => setIsSignup(!isSignup)} />
      <Button title="Sign In with Google" onPress={handleGoogleSignIn} disabled={!request} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default AuthScreen;
