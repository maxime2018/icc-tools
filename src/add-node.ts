import {values} from "lodash"

export function addNode(to: string, db: string, node: string, username: string, password: string) {
  const axios = require('axios')
  const btoa = require('btoa')
  const basicAuth = 'Basic ' + btoa(username + ':' + password);

  return axios.get(`${to}/_dbs/${db}`, {headers: {'Authorization': basicAuth}})
    .then((dbNodes) => {
    if (!dbNodes.data.by_node[node]) {
      const shards = values(dbNodes.data.by_node)[0]
      dbNodes.data.by_node[node] = shards.map((x: any) => x)
      shards.forEach(s => {
        dbNodes.data.changelog.push(["add", s, node])
        dbNodes.data.by_range[s].push(node)
      })
      console.log(JSON.stringify(dbNodes.data))
      return axios.put(`${to}/_dbs/${db}`, dbNodes.data, {headers: {'Authorization': basicAuth}})
    } else {
      return null
    }
  })
}
