export interface ISPList {
  Id: string;
  Title: string;
  Region: string;
  PublishDate: Date;
  ExpiryDate: Date;
  Price: number;
  Weight: string;
  AttachmentFiles: { ServerRelativeUrl: string }[] | null; // Update to allow null values
  isActive: boolean; // Add isActive property
}
