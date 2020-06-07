//
//  CustomFCMModule.swift
//  MusicPro
//
//  Created by Alejandro Gonzalez on 5/23/20.
//

import Foundation
import Firebase
import NotificationCenter

@objc(CustomFCMModule)
class CustomFCMModule: NSObject, MessagingDelegate, UNUserNotificationCenterDelegate {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func getFCMToken(_ callback: @escaping RCTResponseSenderBlock) {
//    let application = UIApplication.shared
//
//    if #available(iOS 10.0, *) {
//      // For iOS 10 display notification (sent via APNS)
//      UNUserNotificationCenter.current().delegate = self
//
//      let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
//      UNUserNotificationCenter.current().requestAuthorization(
//        options: authOptions,
//        completionHandler: {_, _ in })
//    } else {
//      let settings: UIUserNotificationSettings =
//      UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
//      application.registerUserNotificationSettings(settings)
//    }
//
//    Messaging.messaging().delegate = self
    var token = ""
    print("GETTING TOKEN")
    InstanceID.instanceID().instanceID {(result, error) in
      if let error = error {
        token = ("Error fetching remote instance ID: \(error)")
        print(token)
        callback([token])
      } else if let result = result {
        token = result.token
        print("TOKEN TOKEN TOKEN \(token)")
        callback([token])
      }
    }
  }
  
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String) {
    print("HI THERE STRANGER! HERE'S A TOKEN YOU PIECE OF SHIT")
    print(fcmToken)
  }

  
  @objc
  func configureFirebase() {
    FirebaseApp.configure()
  }
  
}
