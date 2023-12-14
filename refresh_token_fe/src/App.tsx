import React, { useEffect, useState } from 'react';
import axios from 'axios'

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.authorization = `bearer ${accessToken}`
  }
  return config 
})

const refresh = async () => {
  const res = await axios.get('http://localhost:3000/user/refresh?refresh_token=' + localStorage.getItem('refreshToken'))
  localStorage.setItem('accessToken', res.data.access_token || '')
  localStorage.setItem('refreshToken', res.data.refresh_token || '')
  return res 
}

let isRefreshing = false 
const queue: any = []
let count = 0
axios.interceptors.response.use((response) => {
  return response
}, async (error) => {
  console.log(error.response)
  const { config, data } = error.response 
  if (isRefreshing) {
    return new Promise((resolve) => {
      queue.push({ resolve, config })
      console.log(queue)
    })
  }
  if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
    isRefreshing = true 
    const res = await refresh()
    isRefreshing = false 
    if (res.status === 200) {
      queue.forEach(({ resolve, config }:any) => {
        resolve(axios(config))
      })
      queue.length = 0
      return axios(config)
    } else {
      alert('login expire')
      return Promise.reject(res.data)
    }
  }
})

function App() {
  const [aaa, setAaa] = useState('')
  const [bbb, setBbb] = useState('')

  const login = async () => {
    const res = await axios.post('http://localhost:3000/user/login', { username: 'eccc', password: '1' })
    localStorage.setItem('accessToken', res.data.access_token)
    localStorage.setItem('refreshToken', res.data.refresh_token)
  }

  
  const query = async () => {
    if (!localStorage.getItem('accessToken')) {
      await login()
    }
    Promise.all([
      axios.get('http://localhost:3000/aaa'),
      axios.get('http://localhost:3000/aaa'),
      axios.get('http://localhost:3000/aaa')
    ])
    try {
      const { data: bbbData } = await axios.get('http://localhost:3000/bbb')
      const { data: aaaData } = await axios.get('http://localhost:3000/aaa')
      setAaa(aaaData)
      setBbb(bbbData)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    query()
  }, [])
  return (
    <div className="App">
      <div>{ aaa }</div>
      <div>{ bbb }</div>
    </div>
  );
}

export default App;
