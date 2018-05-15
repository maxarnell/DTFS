hostname = 'mysql.mit.edu'
username = 'jeffreyr'
password = 'kep44dat'
database = 'jeffreyr+chatbot2018'
import pymysql
import requests
url = "https://api.motion.ai/messageHuman"
def askconsent( conn ) :
    cur = conn.cursor()
    cur.execute( "SELECT phone FROM intake WHERE receivedmail IS NULL AND DATEDIFF(CURDATE(),datemailed) = 3" )
    for mobile in cur.fetchall() :
        payload = {"to":mobile[0],"bot":89944,"key":"9e6767a86ef79b9bf77d28e076a23b5f",'startModule':1374440}
        response = requests.post( url, data=payload)
        print(response.text)

myConnection = pymysql.connect( host=hostname, user=username, passwd=password, db=database )
askconsent( myConnection )
myConnection.close()

def askconsentagain( conn ) :
    cur = conn.cursor()
    cur.execute( "SELECT phone FROM intake WHERE receivedmail = 'n' AND (DATEDIFF(CURDATE(),datemailed) = 5 OR DATEDIFF(CURDATE(),datemailed) = 7 OR DATEDIFF(CURDATE(),datemailed) = 9 OR DATEDIFF(CURDATE(),datemailed) = 11)" )
    for mobile in cur.fetchall() :
        payload = {"to":mobile[0],"bot":89944,"key":"9e6767a86ef79b9bf77d28e076a23b5f",'startModule':1374443}
        response = requests.post( url, data=payload)
        print(response.text)

myConnection = pymysql.connect( host=hostname, user=username, passwd=password, db=database )
askconsentagain( myConnection )
myConnection.close()
