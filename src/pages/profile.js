import React, { useEffect, useState } from 'react'
import { Button, Container, Col, Row, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";

import AuthContext from '../state/auth-context'
import { useApiCall, FETCH_IN_PROGRESS, FETCH_OK, FETCH_KO, FETCH_ERROR } from '../hooks/api-call'
import ErrorMessage from '../components/error-message'
import { BACKEND_BASE_URL } from '../globals'
import CustomSpinner from '../components/custom-spinner'


export default function Profile() {
    const { token } = useContext(AuthContext)
    const [apiError, setApiError] = useState()
    const navigate = useNavigate()
    const schema = yup.object().shape({
        name: yup.string().required('Este campo es obligatorio'),
        surnames: yup.string().required('Este campo es obligatorio'),
        country: yup.string().required('Este campo es obligatorio'),
        province: yup.string().required('Este campo es obligatorio'),
        location: yup.string().required('Este campo es obligatorio'),
        phone: yup.string()
            .required('Este campo es obligatorio')
            .matches(/^(?=[^0-9]*([0-9][^0-9]*){9,20}$)[0-9()+\s]{1,30}$/, 'Formato de teléfono incorrecto'),
        preferences: yup.array().min(1, 'Debes selecciona al menos un interés')
    })
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { preferences: [] },
        resolver: yupResolver(schema)
    })
    
    const registerUserInfo = userInfo => {
        return fetch(`${BACKEND_BASE_URL}/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo)
        })
    }
    
    const apiCallOptions = {
        executeImmediately: false,
        notify: false,
    }

    const [, httpStatus, fetchStatus, onSubmit] = useApiCall(registerUserInfo, apiCallOptions)

    useEffect(() => { document.title = 'Registro: paso 3'}, [])

    useEffect(() => { (token == null) && navigate('/validate-token') }, [token, navigate])

    useEffect(() => {
        switch (fetchStatus) {
            case FETCH_OK:
                navigate('/signup-completed')
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
                <input type="hidden" value={token} {...register('token')}/>
                <fieldset disabled={fetchStatus === FETCH_IN_PROGRESS}>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type='text'  isInvalid={errors.name} {...register('name')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type='text' isInvalid={errors.surnames} {...register('surnames')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.surnames?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>País</Form.Label>
                            <Form.Control type='text' defaultValue='España' isInvalid={errors.country} {...register('country')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.country?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control type='text' defaultValue='Madrid' isInvalid={errors.province} {...register('province')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.province?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Localidad</Form.Label>
                            <Form.Control type='text' defaultValue='Madrid' isInvalid={errors.location} {...register('location')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.location?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type='text' isInvalid={errors.phone} {...register('phone')} />
                            <Form.Control.Feedback type='invalid'>
                                {errors.phone?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5'>
                            <Form.Label>Intereses</Form.Label>
                            <Form.Check type='checkbox' isInvalid={errors.preferences} value='AGRICULTURA' label='Agricultura' {...register('preferences')}/>
                            <Form.Check type='checkbox' isInvalid={errors.preferences} value='INSUMOS AGRÍCOLAS' label='Insumos agrícolas' {...register('preferences')} />
                            <Form.Check type='checkbox' 
                                isInvalid={errors.preferences} 
                                value='INDUSTRIA'
                                label='Industria' 
                                feedback={errors.preferences?.message}
                                feedbackType='invalid'
                                {...register('preferences')} 
                            />
                        </Form.Group>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <Col md='5'><hr /></Col>
                    </Row>
                    <Row className='mb-5 d-flex justify-content-center'>
                        <Form.Group as={Col} md='5' className='d-flex justify-content-center'>
                            <Button variant='primary' type='submit'>Registrar</Button>
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
