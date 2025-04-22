import { PermissionsAndroid, Platform } from 'react-native'

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ 비디오 접근 권한 허용됨')
      } else {
        console.warn('🚨 비디오 접근 권한 거부됨')
      }
    } catch (err) {
      console.error('❌ 권한 요청 실패:', err)
    }
  }
}
