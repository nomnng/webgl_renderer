class AudioManager {
	static currentTrack = null;
	static volumeControlIntervalId = 0;

	static async load(url) {
		return new Promise((resolve, reject) => {
			let audio = new Audio(url);
			audio.oncanplaythrough = () => {
				console.log(`LOADED AUDIO: ${url}`);
				resolve(audio);
			}
			audio.preload = "auto";
			audio.load();
		});
	}

	static play(audio, timeToFullVolume, loop=true, maxVolume=1) {
		if (this.currentTrack) {
			this.removeVolumeControl();
			this.currentTrack.pause();
		}
		this.currentTrack = audio;
		this.currentTrack.loop = loop;
		this.currentTrack.currentTime = 0;

		if (timeToFullVolume !== 0) {
			this.currentTrack.volume = 0;

			let startTime = Date.now();
			this.volumeControlIntervalId = setInterval(() => {
				let volume = maxVolume * (Date.now() - startTime) / timeToFullVolume;
				this.currentTrack.volume = Math.min(volume, 1);
				if (volume > 1) {
					this.removeVolumeControl();
				}
			}, 16);
		} else {
			this.currentTrack.volume = maxVolume;
		}

		this.currentTrack.play();
	}

	static removeVolumeControl() {
		if (this.volumeControlIntervalId) {
			clearInterval(this.volumeControlIntervalId);
			this.volumeControlIntervalId = 0;
		}
	}

	static stop(timeToFullStop) {
		if (!this.currentTrack) {
			return;
		}
		this.removeVolumeControl();

		let startTime = Date.now();
		this.volumeControlIntervalId = setInterval(() => {
			let volume = 1 - (Date.now() - startTime) / timeToFullStop;
			this.currentTrack.volume = Math.max(volume, 0);
			if (volume < 0) {
				this.removeVolumeControl();
				this.currentTrack.pause();
				this.currentTrack = null;
			}
		}, 16);
	}

	static playSingle(audio, volume=1) {
		audio.volume = volume;
		audio.loop = false;
		audio.currentTime = 0;
		audio.play();
	}
}