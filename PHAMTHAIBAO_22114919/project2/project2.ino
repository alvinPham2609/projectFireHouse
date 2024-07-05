#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>

#define APSSID "HSU_Students"
#define APPSK "dhhs12cnvch"
const char *ssid = APSSID;
const char *password = APPSK;
const char *URL = "http://10.106.25.73:8081/add";
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(80);

int trangthai = A0;
int chuong = D6;
int relay = D7;
int giatri = 0;
int nguong = 300; // Giá trị ngưỡng, điều chỉnh theo cảm biến của bạn

void setup()
{
  Serial.begin(9600);
  pinMode(trangthai, INPUT);
  pinMode(chuong, OUTPUT);
  pinMode(relay, OUTPUT);
}

  void loop()
{
  server.handleClient();
  giatri = analogRead(trangthai);

  // Kiểm tra nếu giá trị vượt qua ngưỡng (có lửa)
  if (giatri > nguong)
  {
    Serial.println("khong Lua");
    digitalWrite(chuong, LOW);
    digitalWrite(relay, LOW);
  }
  else
  {
    Serial.println(" co lua !!!");
    digitalWrite(chuong, HIGH);
    digitalWrite(relay, HIGH);
  }

  delay(5000);
}

void handleOnConnect()
{
  server.send(200, "text/html", "ok");
}

void postJsonData()
{
  Serial.print("Connecting to WiFi...");
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Connected!");

    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, URL))
    {
      Serial.print("[HTTP] POST...\n");

      const int capacity = JSON_OBJECT_SIZE(3);
      DynamicJsonDocument doc(capacity);
      doc["id"] = "1";
      doc["buocsong"] = giatri;

      char output[2048];
      serializeJson(doc, Serial);
      serializeJson(doc, output);
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(output);
      Serial.println(httpCode);
      http.end();
      Serial.println();
      Serial.println("Closing connection");
    }
  }
}
