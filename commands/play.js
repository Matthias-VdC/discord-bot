import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import ytdl from "ytdl-core";


// const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const queue = [];

export default async function play(message) {
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channelId,
        guildId: message.member.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false,
    });
    try {
        const songUrl = message.content.split(" ");
        console.log(songUrl);
        const songInfo = await ytdl.getInfo(songUrl[1]);
        const stream = await ytdl(songUrl[1], { filter: 'audioonly', dlChunkSize: 0, quality: "lowest" });
        const song = {
            title: songInfo.videoDetails.title,
            author: songInfo.videoDetails.author.name,
            url: songInfo.videoDetails.video_url,
        }
        const audioResource = createAudioResource(stream, { inlineVolume: true, dlChunkSize: 0 });
        const audioPlayer = createAudioPlayer();
        console.log("Joining voice channel!");
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        connection.subscribe(audioPlayer);
        audioResource.volume.setVolume(0.1);

        audioPlayer.play(audioResource);

        message.reply(`Now playing  -  ${song.title} - Volume: 10%`);
    } catch (err) {
        connection.destroy();
        throw err;
    }
}