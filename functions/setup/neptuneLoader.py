import json
import os
import urllib.request

def lambda_handler(event, context):
    print(json.dumps(event))

    if event['RequestType'] == 'Delete':
        send_response(event, context, 'SUCCESS')
        return

    try:
        endpoint = os.environ['neptunedb']
        s3_path = os.environ['neptuneloads3path']
        iam_role = os.environ['s3loadiamrole']
        region = os.environ.get('region', os.environ.get('AWS_REGION'))

        url = f"https://{endpoint}:8182/loader"
        payload = json.dumps({
            "source": s3_path,
            "format": "csv",
            "iamRoleArn": iam_role,
            "region": region,
            "failOnError": "FALSE",
            "parallelism": "MEDIUM"
        }).encode()

        req = urllib.request.Request(url, data=payload, method='POST')
        req.add_header('Content-Type', 'application/json')
        response = urllib.request.urlopen(req)
        print(f"Neptune loader response: {response.read().decode()}")
    except Exception as e:
        print(f"Error loading Neptune data: {e}")

    send_response(event, context, 'SUCCESS')


def send_response(event, context, status):
    try:
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
    except Exception as e:
        print(f"Failed to send CFN response: {e}")
