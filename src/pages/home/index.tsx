import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import Todos from '@/components/Todos'
import styles from './index.module.less'


const Home = () => {
  return (
    <View className={styles.homeContainer}>
      <Todos />
    </View>
  )
}

export default Home
