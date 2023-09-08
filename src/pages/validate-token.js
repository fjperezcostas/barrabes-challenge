import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useApiCall, FETCH_IN_PROGRESS, FETCH_OK, FETCH_ERROR, FETCH_KO } from '../hooks/api-call'
import { Button, Container, Col, Row, Form, Image } from 'react-bootstrap'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import AuthContext from '../state/auth-context'
import { BACKEND_BASE_URL } from '../globals'
import CustomSpinner from '../components/custom-spinner'
import ErrorMessage from '../components/error-message'

export default function ValidateToken() {

    const { setToken } = useContext(AuthContext);
    const [apiError, setApiError] = useState()
    const { register, handleSubmit, formState: { errors }, getValues } = useForm()
    const navigate = useNavigate()
   
    const validateToken = () => fetch(`${BACKEND_BASE_URL}/signUpRequest/check?token=${getValues('token')}`)
    
    const apiCallOptions = {
        executeImmediately: false,
        notify: false,
    }

    const [, httpStatus, fetchStatus, onSubmit] = useApiCall(validateToken, apiCallOptions)

    useEffect(() => { document.title = 'Registro: validación de token'}, [])

    useEffect(() => {
        switch (fetchStatus) {
            case FETCH_OK:
                setToken(getValues('token'))
                navigate('/profile')
                break
            case FETCH_KO:
                switch (httpStatus) {
                    case 400:
                        setApiError('Formato de token incorrecto.')
                        break
                    case 404:
                        setApiError('Token inválido.')
                        break    
                    case 500:
                        setApiError('Error en el servidor.')
                        break
                    default:
                        setApiError(`Error: ${httpStatus}`)
                }
                break
            case FETCH_ERROR:
                setApiError('Ha ocurrido un error inesperado al comunicarse con el servidor')
                break
            default:
                setApiError()
        }
    }, [httpStatus, fetchStatus, navigate, setApiError, getValues, setToken])
    
    return (  
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
                <fieldset disabled={fetchStatus === FETCH_IN_PROGRESS}>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='3' className='d-flex justify-content-center'>
                            <Image src='barrabes.png' rounded fluid />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center text-center'>
                        <Form.Group as={Col} md='4'>
                            <Form.Label>Introduce el token recibido en tu correo electrónico</Form.Label>
                            <Form.Control type='text' size='lg' isInvalid={errors.token}
                                {...register('token', { required: 'Este campo es obligatorio' })} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.token?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='4' className='d-flex justify-content-center'>
                            <Button variant='primary' type='submit'>Validar</Button>
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
