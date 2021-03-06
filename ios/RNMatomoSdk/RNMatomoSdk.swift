import Foundation
import MatomoTracker

@objc(RNMatomoSdk)
class RNMatomoSdk: NSObject {
    var tracker:MatomoTracker?

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:siteId:resolver:rejecter:)
    func initialize(
        apiUrl: String,
        siteId: NSNumber,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) -> Void {
        tracker = MatomoTracker(siteId: siteId.stringValue, baseURL: URL(string: apiUrl)!)
        resolver(nil)
    }

    @objc(trackView:resolver:rejecter:)
    func trackView(
        route: Array<String>,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) -> Void {
        if let tracker = tracker {
            tracker.track(view: route)
            resolver(nil)
        } else {
            rejecter("not_initialized", "The tracker has not been initialized", NSError())
        }
    }

    @objc(trackEvent:action:optionalParameters:resolver:rejecter:)
    func trackEvent(
        category: String,
        action: String,
        optionalParameters: NSDictionary,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) -> Void {
        if let tracker = tracker {
            tracker.track(eventWithCategory: category,
                          action: action,
                          name: optionalParameters.value(forKey:"name") as? String,
                          number: optionalParameters.value(forKey:"value") as? NSNumber,
                          url: nil
            )
            resolver(nil)
        } else {
            rejecter("not_initialized", "The tracker has not been initialized", NSError())
        }
    }

    @objc(setCustomDimension:value:resolver:rejecter:)
    func setCustomDimension(
        dimensionId: Int,
        value: String?,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) -> Void {
        guard let tracker = tracker else {
            rejecter("not_initialized", "The tracker has not been initialized", NSError())
            return
        }
        if let value = value {
            tracker.setDimension(value, forIndex: dimensionId)
            resolver(nil)
        } else {
            tracker.remove(dimensionAtIndex: dimensionId)
            resolver(nil)
        }
    }
}
