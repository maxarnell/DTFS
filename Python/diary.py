hostname = 'mysql.mit.edu'
username = 'jeffreyr'
password = 'kep44dat'
database = 'jeffreyr+chatbot2018'
import pymysql
import requests
url = "https://api.motion.ai/messageHuman"
def initiatediary( conn ) :
    cur = conn.cursor()
    cur.execute( "SELECT phone FROM intake WHERE consentdone = 'y'" )
    for mobile in cur.fetchall() :
        payload = {"to":mobile[0],"bot":89944,"key":"9e6767a86ef79b9bf77d28e076a23b5f",'startModule':1427301}
        response = requests.post( url, data=payload)
        print(response.text)

myConnection = pymysql.connect( host=hostname, user=username, passwd=password, db=database )
initiatediary( myConnection )
myConnection.close()
