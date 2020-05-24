//
//  CustomFCMModule.m
//  MusicPro
//
//  Created by Alejandro Gonzalez on 5/23/20.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_REMAP_MODULE(CustomFCMModuleiOS, CustomFCMModule, NSObject)
RCT_EXTERN_METHOD(getFCMToken: (RCTResponseSenderBlock)callback)
@end
