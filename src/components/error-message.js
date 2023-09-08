import React from 'react'
import { Alert } from 'react-bootstrap'
import { ExclamationCircle } from 'react-bootstrap-icons'


export default function ErrorMessage({ message }) {

  return (
    <Alert variant='danger'>
        <ExclamationCircle className='align-text-top' /> {message}
    </Alert>
  )
}
