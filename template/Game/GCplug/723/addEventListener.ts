if (!Config.EDIT_MODE) {
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
        if (WorldData.gSaved_advancedIllustrations) {
            const archives = SinglePlayerGame.getSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_archives_advancedIllustration");
            if (archives) WorldData.unlock_archives_advancedIllustrations = archives;
            const avatars = SinglePlayerGame.getSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_avatars_advancedIllustrations");
            if (avatars) WorldData.unlock_avatars_advancedIllustrations = avatars;
        }
    }, this), true);
}
