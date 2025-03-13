declare module "react-native-push-notification" {
    export function createChannel(
      channelDetails: {
        channelId: string;
        channelName: string;
        channelDescription?: string;
        soundName?: string;
        importance?: number;
        vibrate?: boolean;
      },
      callback?: (created: boolean) => void
    ): void;
  
    export function localNotificationSchedule(notificationDetails: {
      channelId: string;
      title: string;
      message: string;
      date: Date;
      allowWhileIdle?: boolean;
      soundName?: string;
      vibrate?: boolean;
      repeatType?: "day" | "week" | "month" | "year";
    }): void;
  }
  