import boto3
import json
import urllib.request

def handler(event, context):
    print(json.dumps(event))

    if event['RequestType'] != 'Delete':
        send_response(event, context, 'SUCCESS')
        return

    try:
        bucket_names = event['ResourceProperties'].get('BucketNames', [])
        s3 = boto3.resource('s3')
        for bucket_name in bucket_names:
            print(f"Emptying bucket: {bucket_name}")
            bucket = s3.Bucket(bucket_name)
            bucket.objects.all().delete()
            bucket.object_versions.all().delete()
            print(f"Bucket {bucket_name} emptied")
        send_response(event, context, 'SUCCESS')
    except Exception as e:
        print(f"Error: {e}")
        send_response(event, context, 'SUCCESS')


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
