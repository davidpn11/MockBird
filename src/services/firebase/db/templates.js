import { database } from '../firebase'

export function getTemplatesAPI() {
  return new Promise((resolve, reject) => {
    database
      .collection('/templates')
      .get()
      .then(result => {
        if (!result.empty) {
          //   resolve(doc.data())
          let templates = []
          result.docs.forEach(doc => {
            templates = [...templates, { id: doc.id, ...doc.data() }]
          })
          resolve(templates)
        } else {
          reject(new Error('No Templates'))
        }
      })
      .catch(err => reject(err))
  })
}
