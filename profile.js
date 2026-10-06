/* =========================================================
   LARCK PROFILE
========================================================= */


/* =========================================================
   SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL = "https://hxtwdzvnqtxoutdetfoy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_hEot0ds6XIcLYo7Fj8xtUQ_0ICFxMBV";

const larckSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    try {

        /* Get currently logged-in user */

        const {
            data: {
                user
            },
            error: userError
        } = await larckSupabase.auth.getUser();


        if (userError) {

            console.error(
                "Could not get user:",
                userError
            );

            return;
        }


        if (!user) {

            console.log("No logged-in user.");

            return;
        }


        /* Find this user's profile */

        const {
            data: profile,
            error: profileError
        } = await larckSupabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();


        if (profileError) {

            console.error(
                "Could not load profile:",
                profileError
            );

            return;
        }


        if (!profile) {

            console.log("Profile not found.");

            return;
        }


        /* Display profile */

        displayProfile(profile, user);

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* =========================================================
   DISPLAY PROFILE
========================================================= */

function displayProfile(profile, user) {


    /* =========================
       USERNAME
    ========================== */

    const username =
        document.getElementById("username");

    if (username) {

        username.textContent =
            profile.username || "Username";

    }


    /* =========================
       LARCK ID
    ========================== */

    const larckId =
        document.getElementById("larckId");

    if (larckId) {

        larckId.textContent =
            profile.larck_id || "LARCK ID";

    }


    /* =========================
       PROFILE PICTURE
    ========================== */

    const profilePicture =
        profile.profile_picture || "";


    const profileImage =
        document.getElementById("profilePicture");

    const coverImage =
        document.getElementById("coverImage");


    /*
       IMPORTANT:

       The SAME profile picture is used
       for both the circular picture
       and the cover.
    */

    if (profileImage && profilePicture) {

        profileImage.src =
            profilePicture;

    }


    if (coverImage && profilePicture) {

        coverImage.src =
            profilePicture;

    }


    /* =========================
       COUNTRY
    ========================== */

    const countryName =
        document.getElementById("countryName");

    if (countryName) {

        countryName.textContent =
            profile.country || "Country";

    }


    /* =====================================================
       OWN PROFILE VS OTHER USER PROFILE
    ===================================================== */

    const otherUserActions =
        document.getElementById("otherUserActions");

    const editProfileBottom =
        document.getElementById("editProfileBottom");


    /*
       If this profile belongs to the
       currently logged-in user:

       SHOW:
       Edit Self

       HIDE:
       Follow
       Message
    */

    if (profile.id === user.id) {

        if (otherUserActions) {

            otherUserActions.style.display =
                "none";

        }


        if (editProfileBottom) {

            editProfileBottom.style.display =
                "flex";

        }

    }


    /*
       If this profile belongs to
       somebody else:

       SHOW:
       Follow
       Message

       HIDE:
       Edit Self
    */

    else {

        if (otherUserActions) {

            otherUserActions.style.display =
                "flex";

        }


        if (editProfileBottom) {

            editProfileBottom.style.display =
                "none";

        }

    }

}


/* =========================================================
   COPY LARCK ID
========================================================= */

document
    .getElementById("copyIdButton")
    ?.addEventListener("click", async () => {

        const id =
            document
                .getElementById("larckId")
                ?.textContent;


        if (!id || id === "LARCK ID") {

            return;

        }


        try {

            await navigator.clipboard.writeText(id);


            const button =
                document.getElementById(
                    "copyIdButton"
                );


            const original =
                button.textContent;


            button.textContent = "✓";


            setTimeout(() => {

                button.textContent =
                    original;

            }, 1200);

        }

        catch (error) {

            console.error(
                "Could not copy LARCK ID:",
                error
            );

        }

    });


/* =========================================================
   BACK BUTTON
========================================================= */

document
    .getElementById("backButton")
    ?.addEventListener("click", () => {

        window.history.back();

    });


/* =========================================================
   START
========================================================= */

loadProfile();

