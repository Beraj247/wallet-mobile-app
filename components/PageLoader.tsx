import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constants/color'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

function PageLoader() {
  return (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

export default PageLoader