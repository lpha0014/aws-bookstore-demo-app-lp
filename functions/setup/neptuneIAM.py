import boto3
import json
import urllib.request

def lambda_handler(event, context):
    print(json.dumps(event))
    
    if event['RequestType'] == 'Delete':
        send_response(event, context, 'SUCCESS')
        return

    try:
        neptune_cluster = event['ResourceProperties']['NeptuneDB']
        iam_role = event['ResourceProperties']['IAMRole']
        region = event['ResourceProperties']['Region']

        client = boto3.client('neptune', region_name=region)
        client.add_role_to_db_cluster(
            DBClusterIdentifier=neptune_cluster,
            RoleArn=iam_role
        )
        print(f"Added role {iam_role} to cluster {neptune_cluster}")
        send_response(event, context, 'SUCCESS')
    except Exception as e:
        print(f"Error: {e}")
        send_response(event, context, 'SUCCESS')  # Don't fail stack on error


def send_response(event, context, status):
    body = json.dumps({
        'Status': status,
        'Reason': f'See CloudWatch Log Stream: {context.log_stream_name}',
        'PhysicalResourceId': context.log_stream_name,
        'StackId': event['StackId'],
        'RequestId': event['RequestId'],
        'LogicalResourceId': event['LogicalResourceId'],
    }).encode()

    req = urllib.request.Request(event['ResponseURL'], data=body, method='PUT')
    req.add_header('Content-Type', '')
    req.add_header('Content-Length', str(len(body)))
    urllib.request.urlopen(req)
