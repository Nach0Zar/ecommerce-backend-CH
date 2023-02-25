export default {
  apps : [{
    name   : "node-0",
    script : "./src/server.js",
    args   :  "-p=8080 -m=fork"
  },
  {
    name   : "node-1",
    script : "./src/server.js",
    args   :  "-p=8081 -m=cluster"
  },
  {
    name   : "node-2",
    script : "./src/server.js",
    args   :  "-p=8082 -m=fork"
  },
  {
    name   : "node-3",
    script : "./src/server.js",
    args   :  "-p=8083 -m=fork"
  },
  {
    name   : "node-4",
    script : "./src/server.js",
    args   :  "-p=8084 -m=fork"
  },
  {
    name   : "node-5",
    script : "./src/server.js",
    args   :  "-p=8085 -m=fork"
  }]
}
