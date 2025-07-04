import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '@/assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
// import { Image } from 'expo-image'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState("")

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err : any) {
      if(err.errors?.[0]?.code === "form_password_incorrect") {
        setErr("Password is incorrect. Please try again.");
      } else {
        setErr("An error occured. Please try again.");
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      // style={customStyles.screenCenter}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/login.png")} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>

        {err ? (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{err}</Text>
            <TouchableOpacity onPress={() => setErr("")}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, err && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, err && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          placeholderTextColor={COLORS.textLight}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          {/* <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity> */}
          <Link href={"/sign-up"} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}