// const uploadFileToDropbox = async lastrecording => {
//   //console.log('Uploading', lastRecording);
//   const dropboxAccessToken =
//     'sl.Bv_iO_UeiZEUT33HCqc0t5EG3XYyvIKotq1ipl6kphjeLQKv5KuUGlnFJ332eg9M-mbCFGLE60r_cnwHluWQPEAqeOwhgRAnDRFMKBy2p2H1EBAmB0HqPbNR3fiY2WXBxPfAYPQxa2Z-Ki4gag_GTzQ';
//   const dropboxApiArg = JSON.stringify({
//     path: '/your-app-folder/hello.mp3',
//     mode: 'add',
//     autorename: true,
//     mute: false,
//   });

//   try {
//     setIsUploading(true);
//     const fileStats = await RNFS.stat(lastRecording.replace('file://', '')); // Remove 'file://' prefix for RNFS compatibility
//     console.log('File size>>>>>>>>>>>>>>>>>>>>>>>>>>>>:', fileStats.size);
//     if (fileStats.size === 0) {
//       console.error('File is empty, not uploading.');
//       // Exit the function if file is empty
//     }

//     console.log('fileData');
//     // console.log(lastrecording);
//     // Using RNFetchBlob to handle the file upload
//     const response = await RNFetchBlob.fetch(
//       'POST',
//       'https://content.dropboxapi.com/2/files/upload',
//       {
//         Authorization: `Bearer ${dropboxAccessToken}`,
//         'Dropbox-API-Arg': dropboxApiArg,
//         'Content-Type': 'application/octet-stream',
//       },

//       RNFetchBlob.wrap(lastRecording),
//     );

//     console.log('File uploaded!', response.text());

//     setIsUploading(false);
//     setUploadProgress(100); // Since RNFetchBlob doesn't support onUploadProgress, you might set it to 100% on success
//   } catch (error) {
//     console.error('Upload failed', error);
//     setIsUploading(false);
//   }
// };
