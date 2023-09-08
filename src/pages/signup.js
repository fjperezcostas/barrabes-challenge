import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Container, Col, Row, Form, InputGroup, Image } from 'react-bootstrap'
import { Eye, EyeSlash } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'

import { BACKEND_BASE_URL } from '../globals'
import { useApiCall, FETCH_IN_PROGRESS, FETCH_OK, FETCH_KO, FETCH_ERROR } from '../hooks/api-call'
import CustomSpinner from '../components/custom-spinner'
import ErrorMessage from '../components/error-message'


export default function SignUp() {
    
    const [showPassword, setShowPassword] = useState(false)
    const [apiError, setApiError] = useState()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    
    const registerNewAccount = accountInfo => {
        return fetch(`${BACKEND_BASE_URL}/signupRequest/save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountInfo)
        })
    }
    
    const apiCallOptions = {
        executeImmediately: false,
        notify: false
    }

    const [, httpStatus, fetchStatus, onSubmit] = useApiCall(registerNewAccount, apiCallOptions)

    useEffect(() => { document.title = 'Registro: paso 1'}, [])

    useEffect(() => {
        switch (fetchStatus) {
            case FETCH_OK:
                navigate('/check-mail')
                break
            case FETCH_KO:
                switch (httpStatus) {
                    case 400:
                        setApiError('Existe un problema con los datos registrados. Revísalos y reenvía la solicitud.')
                        break
                    case 500:
                        setApiError('En estos momentos hay un problema con la plataforma. Inténtalo más tarde.')
                        break
                    default:
                        setApiError(`Error: ${httpStatus}`)
                }
                break
            case FETCH_ERROR:
                setApiError('Ha ocurrido un error inesperado al comunicarse con el servidor.')
                break
            default:
                setApiError()
        }
    }, [httpStatus, fetchStatus, navigate, setApiError])

    return (
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
                <fieldset disabled={fetchStatus === FETCH_IN_PROGRESS}>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='2' className='d-flex justify-content-center'>
                            <Image src='barrabes.png' rounded fluid />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='text' 
                                isInvalid={errors.username}
                                {...register('username', { 
                                    required: 'Este campo es obligatorio', 
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: 'Formato de email incorrecto' 
                                    }
                                })} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.username?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='3'>
                            <Form.Label>Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword  ? 'text' : 'password'} 
                                    isInvalid={errors.password} 
                                    {...register('password', {
                                        required: 'Este campo es obligatorio', 
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
                                            message: 'La contraseña debe contener mayúsculas, minúsculas, dígitos y un mínimo de 8 caracteres' 
                                        }
                                    })} />
                                <Button variant='primary' className='rounded-end' onClick={() => setShowPassword(!showPassword)}>
                                    {(showPassword) ? <EyeSlash /> : <Eye />}
                                </Button>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.password?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className='mb-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='3' className='d-flex justify-content-center'>
                            <Button variant='primary' type='submit'>Enviar</Button>
                        </Form.Group>
                    </Row>
                </fieldset>
                <Row className='mb-5 d-flex justify-content-center'>
                    <Col md='12' className='d-flex justify-content-center'>
                        {fetchStatus === FETCH_IN_PROGRESS && <CustomSpinner />}
                        {apiError && <ErrorMessage message={apiError} />}
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}
