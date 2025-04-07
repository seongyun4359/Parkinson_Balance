#ifndef ClarityInternalHelpers_h
#define ClarityInternalHelpers_h

#import <Foundation/Foundation.h>

@interface ClarityInternalHelpers : NSObject

+ (id)safeValueForKey:(NSString *)key fromObject:(id)object;

@end

#endif /* ClarityInternalHelpers_h */
