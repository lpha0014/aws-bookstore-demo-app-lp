import json
import os
from gremlin_python.structure.graph import Graph
from gremlin_python.process.traversal import P
from gremlin_python.process.graph_traversal import __
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

myNeptuneEndpoint = "ws://" + os.environ["neptunedb"] + ":8182/gremlin"  # Neptune cluster URL

# GetRecommendationsByBook - Get list of friends who have purchased this book and how many times it was purchased by those friends
def handler(event, context):

    graph = Graph()
    g = graph.traversal().withRemote(DriverRemoteConnection(myNeptuneEndpoint, "g"))

    bookId = event["pathParameters"]["bookId"]
    toReturn = (
        g.V(bookId).
            project("friendsPurchased", "purchased").
            by(__.in_("purchased").dedup().where(__.id_().is_(P.neq(bookId))).id_().fold()).
            by(__.in_("purchased").count()).
            toList()
    )

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True
        },
        "body": json.dumps(toReturn)
    }

    print(response)
    return response
