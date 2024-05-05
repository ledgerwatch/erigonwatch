export const multipleBytes = (bytes: number): string => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

export const multipleBps = (bps: number): string => {
	if (isNaN(bps) || bps === undefined || bps === null || bps === 0) {
		return "0 B/s";
	}

	const sizes = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];
	const i = Math.floor(Math.log(bps) / Math.log(1024));
	return (bps / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

export const bpsToMbps = (bps: number): string => {
	if (bps === 0) return "0 MB/s";
	return (bps / 1024 / 1024).toFixed(2) + " MB/s";
};

export const numberToPercentString = (num: number) => {
	if (num === undefined || num === null || isNaN(num)) {
		return "0%";
	} else {
		return num.toFixed(2) + "%";
	}
};

export const secondsToHms = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const hoursStr = hours > 0 ? hours + "h " : "";
	const minutesStr = minutes > 0 ? minutes + "m " : "";
	const secondsStr = remainingSeconds + "s";

	return hoursStr + minutesStr + secondsStr;
};

export const clculateDownloadTimeLeft = (downloaded: number, total: number, downloadRate: number): string => {
	if (downloadRate === 0) {
		return "999hrs:99m";
	}
	const amountLeft = total - downloaded;
	const timeLeftInSeconds = amountLeft / downloadRate;

	return secondsToHms(timeLeftInSeconds);
};

export const calculatePercentDownloaded = (downloaded: number, total: number): string => {
	if (downloaded === 0 || total === 0) {
		return "0%";
	}

	return numberToPercentString((downloaded / total) * 100);
};

export const bytesToSpeedPerSecond = (bytes: number): string => {
	return multipleBytes(bytes) + "/s";
};
