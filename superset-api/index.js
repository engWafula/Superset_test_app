const express = require("express")
const cors = require("cors")
const PORT = 9000
const app = express()
app.use(cors())
app.use(express.json())

async function fetchAccessToken() {
  try {
    const body = {
      username: "allan",
      password: "123456",
      provider: "db",
      refresh: false,
    }

    const response = await fetch(
      "http://localhost:8080/api/v1/security/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const jsonResponse = await response.json()
    return jsonResponse?.access_token
  } catch (e) {
    console.error(e)
  }
}


async function fetchCsrfToken() {
    try {
        const accessToken = await fetchAccessToken()
      const response = await fetch(
        "http://localhost:8080/api/v1/security/csrf_token",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
        }
      )
  
      const jsonResponse = await response.json()
      return jsonResponse?.result
    } catch (e) {
      console.error(error)
    }
  }

async function fetchGuestToken() {
  const accessToken = await fetchAccessToken()
  const csrfToken = await fetchCsrfToken()

  try {
    const body = {
      resources: [
        {
          type: "dashboard",
          id: "11e861a1-2985-497f-9597-672c463a1831",
        },
      ],
      rls: [],
      user: {
        username: "allan",
        first_name: "allan",
        last_name: "allan",
      },
    }
    const response = await fetch(
      "http://localhost:8080/api/v1/security/guest_token",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 
          'X-CSRF-TOKEN': 'IjZjNTdiMjRiZjM4NjA3YWMzNjA3OTlmYmUyYzRhY2Q4M2Y3ZWQ2MTAi.ZZ_Qcg.cx5JoXrgJIdNmhzi6e3tKSpcIg4', 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzA0OTcyMzcwLCJqdGkiOiJmM2FiOTAwNS03ZWZmLTRmNjUtYTFhMy0wMTRhMDdjZjZkYmMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJuYmYiOjE3MDQ5NzIzNzAsImV4cCI6MTcwNDk3MzI3MH0.6rWG78FH6uz9nvJGj-4gHlj9d2MrkqBTsusMFavLuuQ', 
          'Cookie': 'session=eyJfZnJlc2giOmZhbHNlLCJjc3JmX3Rva2VuIjoiNmM1N2IyNGJmMzg2MDdhYzM2MDc5OWZiZTJjNGFjZDgzZjdlZDYxMCIsImxvY2FsZSI6ImVuIn0.ZZ_QhA.M5GryH4T2NmCBqcMYszIyLc2_NI'
        },
      }
    )
    const jsonResponse = await response.json()
    return jsonResponse?.token
  } catch (error) {
    console.log(error)
  }
}

app.get("/guest-token", async (req, res) => {
  const token = await fetchGuestToken()
  res.json({token:token})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  