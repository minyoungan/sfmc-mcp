export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {

    @header("Pop-Up Type")

    lightbox: boolean = true;

    @title("Background Image URL")
    imageUrl: string = "https://image.email.dogtopia.com/lib/fe3611737164047b751172/m/1/b0f6c5c3-501c-4e5e-836d-305143ef13e5.jpg";

    @subtitle("Define header and subheader text styling.")
    @options([
        { label: "Light on Dark", className: "evg-light-on-dark" },
        { label: "Dark on Light", className: "evg-dark-on-light" }
    ])
    style: StyleField = { label: "Light on Dark", className: "evg-light-on-dark" };

    header: string = "We're the perfect place for dogs to stay & play!";

    @subtitle("Optional text field")
    subheader: string = "Learn why Dogtopia is every dog's favorite home away from home";

    @title("CTA Text")
    ctaText: string = "Submit";

    @title("Opt-Out Text")
    @subtitle("Clicking this text closes the pop-up.")
    optOutText: string = "No Thanks";


    run(context: CampaignComponentContext) {
        return {};
    }

}
