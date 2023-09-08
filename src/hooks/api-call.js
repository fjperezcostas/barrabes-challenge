import { useEffect, useState} from "react";

export const FETCH_PENDING = "PENDING";
export const FETCH_IN_PROGRESS = "IN_PROGRESS";
export const FETCH_OK = "OK";
export const FETCH_KO = "KO";
export const FETCH_ERROR = "ERROR";

const doLog = false;

function log() {
    doLog && console.log( ...arguments);
}

export function useApiCall(
    apiCall,
    {
        executeImmediately = true,
        notify = true,
        onSuccess,
        onFailure
    } = {}
) {
    const [fetchState, setFetchState] = useState(FETCH_PENDING);
    const [response, setResponse] = useState();
    const [httpStatus, setHttpStatus] = useState()

    const fetchCall = (data) => {
        log("Doing api call", apiCall);
        setFetchState(FETCH_IN_PROGRESS);
        return apiCall(data)
            .then((res) => {
                setHttpStatus(res.status)
                if (res.ok) {
                    log("Success on api call", apiCall, "response was", res);
                    setFetchState(FETCH_OK);
                    onSuccess?.call();
                    return res.status === 204 ? null : res.json()
                } else {
                    log("Ko success on api call", apiCall, "response was", res);                            
                    setFetchState(FETCH_KO)                    
                    onFailure?.call();
                }
            })
            .then((res) => {
                return res && setResponse(res)
            })
            .catch((errors) => {
                console.log("Error on api call", apiCall, "error was", errors);
                notify && console.log('notifying to component...')
                setFetchState(FETCH_ERROR);
            });
    };
    // eslint-disable-next-line
    useEffect(() => { executeImmediately && fetchCall() }, [])
    return [response, httpStatus, fetchState, fetchCall];
}
