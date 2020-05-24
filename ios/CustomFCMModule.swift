//
//  CustomFCMModule.swift
//  MusicPro
//
//  Created by Alejandro Gonzalez on 5/23/20.
//

import Foundation
import Firebase

@objc(CustomFCMModule)
class CustomFCMModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func getFCMToken(_ callback: @escaping RCTResponseSenderBlock) {
    var token = ""
    InstanceID.instanceID().instanceID {(result, error) in
      if let error = error {
        token = error.localizedDescription
        print("Error fetching remote instance ID: \(error)")
        callback([token])
      } else if let result = result {
        token = result.token
        callback([token])
      }
    }
  }
}
