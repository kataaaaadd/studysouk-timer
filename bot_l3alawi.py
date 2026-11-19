import asyncio
import os
import discord
from discord import app_commands
from discord.ext import commands

# Load local .env if present
def load_env():
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

load_env()

TOKEN = os.getenv("DISCORD_TOKEN", "")
STUDYSOUK_TIMER_APP_ID = 1572928085362479104

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

class ActivityLaunchView(discord.ui.View):
    def __init__(self, invite_url: str):
        super().__init__(timeout=None)
        self.add_item(discord.ui.Button(
            label="🚀 Rejoindre StudySouk Timer",
            style=discord.ButtonStyle.link,
            url=invite_url,
            emoji="⏱️"
        ))

@bot.event
async def on_ready():
    print(f"==================================================")
    print(f"🤖 STUDYSOUK TIMER BOT IS ONLINE!")
    print(f"ID: {bot.user.id} | User: {bot.user.name}#{bot.user.discriminator}")
    print(f"Connected to {len(bot.guilds)} guild(s):")
    for g in bot.guilds:
        print(f" - {g.name} ({g.id})")
        try:
            synced = await bot.tree.sync(guild=discord.Object(id=g.id))
            print(f"   Synced {len(synced)} slash commands to '{g.name}'!")
        except Exception as e:
            print(f"   Sync error for {g.name}: {e}")
    print(f"==================================================")

    # Set status
    activity = discord.Activity(
        type=discord.ActivityType.listening,
        name="StudySouk Timer • /join"
    )
    await bot.change_presence(status=discord.Status.online, activity=activity)

@bot.tree.command(name="ping", description="Vérifie si le bot StudySouk Timer est en ligne")
async def slash_ping(interaction: discord.Interaction):
    latency = round(bot.latency * 1000)
    await interaction.response.send_message(f"🏓 **Pong !** StudySouk Timer est en ligne (`{latency}ms`).", ephemeral=True)

@bot.tree.command(name="activity", description="Lance l'activité StudySouk Timer dans ton salon vocal")
@app_commands.describe(channel="Salon vocal où lancer l'activité (optionnel, prend ton salon actuel par défaut)")
async def slash_activity(interaction: discord.Interaction, channel: discord.VoiceChannel = None):
    await interaction.response.defer(ephemeral=False)

    target_vc = channel
    if not target_vc:
        if interaction.user.voice and interaction.user.voice.channel:
            target_vc = interaction.user.voice.channel
        else:
            await interaction.followup.send(
                "🎙️ **Connexion vocale nécessaire !**\n"
                "> Tu dois d'abord rejoindre un salon vocal pour lancer l'activité !",
                ephemeral=True
            )
            return

    try:
        invite = await target_vc.create_invite(
            target_type=discord.InviteTarget.embedded_application,
            target_application_id=STUDYSOUK_TIMER_APP_ID,
            max_age=86400,
            reason=f"StudySouk Timer lancé par {interaction.user.display_name}"
        )
    except Exception as e:
        await interaction.followup.send(
            f"⚠️ **Erreur lors de la création de l'Activité :** `{e}`",
            ephemeral=True
        )
        return

    embed = discord.Embed(
        title="⏱️ StudySouk Timer — Activité Prête !",
        description=(
            f"### ◈ SESSION D'ÉTUDE & POMODORO PARTAGÉ\n\n"
            f"> 🎙️ **Salon Vocal :** {target_vc.mention}\n"
            f"> 👑 **Lancé par :** {interaction.user.mention}\n"
            f"> 🎮 **Inclus :** Minuteur Pomodoro Partagé, Concours Countdowns (CNC & Prépa), Tableau Blanc Collaboratif, Formules KaTeX & STEM Duels 1v1 !\n\n"
            f"**Clique sur le bouton ci-dessous pour ouvrir l'activité :**"
        ),
        color=0x7A0E27
    )
    embed.set_footer(text="StudySouk Academy • Excellence STEM", icon_url=bot.user.display_avatar.url)

    view = ActivityLaunchView(invite.url)
    await interaction.followup.send(embed=embed, view=view)

# Alias command /join for easy access
@bot.tree.command(name="join", description="Rejoint l'activité StudySouk Timer dans ton salon vocal")
@app_commands.describe(channel="Salon vocal où lancer l'activité (optionnel)")
async def slash_join(interaction: discord.Interaction, channel: discord.VoiceChannel = None):
    await slash_activity(interaction, channel)

# Text commands !activity & !join
@bot.command(name="activity", aliases=["join", "timer"])
async def cmd_activity(ctx: commands.Context):
    if not ctx.author.voice or not ctx.author.voice.channel:
        await ctx.send("🎙️ Rejoint d'abord un salon vocal !")
        return
    vc = ctx.author.voice.channel
    try:
        inv = await vc.create_invite(
            target_type=discord.InviteTarget.embedded_application,
            target_application_id=STUDYSOUK_TIMER_APP_ID,
            max_age=86400
        )
        view = ActivityLaunchView(inv.url)
        await ctx.send(f"⏱️ **StudySouk Timer** est prêt dans {vc.mention} !\n👉 Clique ici : {inv.url}", view=view)
    except Exception as e:
        await ctx.send(f"Erreur : {e}")

if __name__ == "__main__":
    bot.run(TOKEN)
