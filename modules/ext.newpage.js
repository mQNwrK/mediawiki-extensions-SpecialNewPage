mw.hook( 'htmlform.enhance' ).add( $root => {
	const
        fieldLayout = OO.ui.infuse( $root.find( '.mw-htmlform-field-HtmlComplexTitleField' ) ),
        complexWidget = mw.widgets.ComplexTitleInputWidget.static.infuse( $root.find( '#mw-input-wptitle' ) ),
        titleWidget = complexWidget.title,
        namespaceInput = complexWidget.namespace,
        submitButton = OO.ui.infuse( $root.find( '.mw-htmlform-submit' ) ),
        beforeSubmitText = document.createElement( 'p' );

    function setValid( value ) {
        beforeSubmitText.style.display = value ? '' : 'none';
        submitButton.setDisabled( !value );

        const needsError = !value && titleWidget.getValue().length > 0;
        if ( !needsError ) {
            fieldLayout.setErrors( [] );
        } else {
            fieldLayout.setErrors( [ mw.msg( 'title-invalid' ) ] );
        }
    }
    
    function updateSubmitText() {
        const namespaceId = namespaceInput.getValue(),
            title = mw.Title.makeTitle( namespaceId, titleWidget.getValue() );

        if ( !title ) {
            setValid( false );
            return;
        }

        const
            nsMsg = `extnewpage-newpagetext-${namespaceInput.getValue()}`,
            fallbackMsg = 'extnewpage-newpagetext-fallback',
            msg = mw.message(
                mw.messages.exists( nsMsg ) ? nsMsg : fallbackMsg,
                title.getPrefixedText()
            );
        beforeSubmitText.innerHTML = msg.parse();

        setValid( true );
    }

    titleWidget.on( 'change', updateSubmitText );
    namespaceInput.on( 'change', updateSubmitText );
    
    beforeSubmitText.style.display = 'none';
    $root.find( '.mw-htmlform-submit-buttons' ).before( beforeSubmitText );
} );
