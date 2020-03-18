import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert } from 'vtex.styleguide'

interface Props {
  showToast: boolean
  message: string
  type: string
  onClose: () => void
}

const Toast = ({ showToast = false, type, message, onClose }: Props) => {
  const [isClosing, setIsClosing] = useState(!showToast)
  
  let closingTimeout: any
  let openTimeout: any

  useEffect(() => {
    setIsClosing(false)
    openTimeout = setTimeout(() => {
      setIsClosing(true)
      closingTimeout = setTimeout(() => {
        onClose()
      }, 3000)
    }, 5000)

    return () => {
      clearTimeout(openTimeout)
      clearTimeout(closingTimeout)
    }
  }, [showToast])

  return (
    <div
      className={`animated ${
        isClosing ? 'fadeOutDown' : 'fadeInUp'
      }  slower bottom--1 fixed z-5 ma7-ns mb5-s left-2-ns w-100-s w-30-ns`}
    >
      <Alert type={type} onClose={onClose}>
        {message}
      </Alert>
    </div>
  )
}

export default Toast
