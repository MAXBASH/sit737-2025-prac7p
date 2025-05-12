1.	Run “docker build -t todoapp:latest .” to build docker image.

2.	Run “docker compose up”

3.	mongodb-deployment.yaml

  Apply the MongoDB Kubernetes configuration by running “kubectl apply -f mongodb-deployment.yaml”

4.	Verify the Persistent Volume Claim was created by using “kubectl get pvc”

5.	todoapp-deployment.yaml

  Apply the Todo App Kubernetes configuration by running “kubectl apply todoapp-deployment.yaml”

6.	Verify that the Todo App pod is running by using “kubectl get pods”
 
7.	Run “kubectl get services todoapp” Get the service URL

8.	CURD Operations

GET - http://localhost/api/todos

Response:
[
    {
        "_id": "6822142afcb67506ddb33881",
        "text": "aaa",
        "completed": false,
        "createdAt": "2025-05-12T15:30:50.099Z",
        "__v": 0
    },
    {
        "_id": "68221136547db4202a662986",
        "text": "teask2",
        "completed": false,
        "createdAt": "2025-05-12T15:18:14.284Z",
        "__v": 0
    }
]

 


POST – http://localhost/api/todos


Payload:

{
    "text": "teask3"
}

Response:

{
    "text": "teask3",
    "completed": false,
    "_id": "6822159cfcb67506ddb33884",
    "createdAt": "2025-05-12T15:37:00.484Z",
    "__v": 0
}



PUT - http://localhost/api/todos/:id

Payload:
{
    "text": "task3"
}

Response:
{
    "_id": "6822159cfcb67506ddb33884",
    "text": "task3",
    "completed": false,
    "createdAt": "2025-05-12T15:37:00.484Z",
    "__v": 0
}
 


DELETE - http://localhost/api/todos/:id

Response:
{
    "success": true
}
 


9.	Creating a Backup of mongodb
 
10.	“kubectl logs deployment/mongodb” to check logs of mongodb

“kubectl logs deployment/todoapp” to check logs of application

 
11.	“kubectl scale deployment todoapp –replicas=3” to scale the Todo App to multiple replicas
