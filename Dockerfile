FROM ghcr.io/nodecg/nodecg:latest

USER nodecg

RUN nodecg install jhobz/de-wdg-broadcast && nodecg defaultconfig de-wdg-broadcast

COPY --chown=nodecg:nodecg . /opt/nodecg/bundles/de-wdg-broadcast