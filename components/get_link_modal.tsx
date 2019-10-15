// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import SuccessIcon from 'components/widgets/icons/fa_success_icon';

type Props = {
    show: boolean;
    onHide: () => void;
    title: string;
    helpText?: string;
    link: string;
}

type State = {
    copiedLink: boolean;
}

export default class GetLinkModal extends React.PureComponent<Props, State> {
    private textAreaRef = React.createRef<HTMLTextAreaElement>();
    public static defaultProps = {
        helpText: null,
    };

    public constructor(props: Props) {
        super(props);
        this.state = {
            copiedLink: false,
        };
    }

    public onHide = (): void => {
        this.setState({copiedLink: false});
        this.props.onHide();
    }

    public copyLink = () => {
        const textarea = this.textAreaRef.current;

        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(0, this.props.link.length);

            try {
                this.setState({copiedLink: document.execCommand('copy')});
            } catch (err) {
                this.setState({copiedLink: false});
            }
        }
    }

    public render(): JSX.Element {
        const helpText: JSX.Element = this.props.helpText ? (
            <p>
                {this.props.helpText}
                <br/>
                <br/>
            </p>
        ) : <div/>;

        const copyLink: JSX.Element = document.queryCommandSupported('copy') ? (
            <button
                id='linkModalCopyLink'
                data-copy-btn='true'
                type='button'
                className='btn btn-primary pull-left'
                onClick={this.copyLink}
            >
                <FormattedMessage
                    id='get_link.copy'
                    defaultMessage='Copy Link'
                />
            </button>
        ) : <div/>;

        const linkText: JSX.Element = (
            <textarea
                id='linkModalTextArea'
                className='form-control no-resize min-height'
                ref={this.textAreaRef}
                value={this.props.link}
                onClick={this.copyLink}
                readOnly={true}
            />
        );

        const copyLinkConfirm: JSX.Element = this.state.copiedLink ? (
            <p className='alert alert-success alert--confirm'>
                <SuccessIcon/>
                <FormattedMessage
                    id='get_link.clipboard'
                    defaultMessage=' Link copied'
                />
            </p>
        ) : <div/>;

        return (
            <Modal
                dialogClassName='a11y__modal'
                show={this.props.show}
                onHide={this.onHide}
                role='dialog'
                aria-labelledby='getLinkModalLabel'
            >
                <Modal.Header
                    id='getLinkModalLabel'
                    closeButton={true}
                >
                    <h4 className='modal-title'>{this.props.title}</h4>
                </Modal.Header>
                <Modal.Body>
                    {helpText}
                    {linkText}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        id='linkModalCloseButton'
                        type='button'
                        className='btn btn-link'
                        onClick={this.onHide}
                    >
                        <FormattedMessage
                            id='get_link.close'
                            defaultMessage='Close'
                        />
                    </button>
                    {copyLink}
                    {copyLinkConfirm}
                </Modal.Footer>
            </Modal>
        );
    }
}
