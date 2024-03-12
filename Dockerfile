FROM ghcr.io/nodecg/nodecg:latest

USER nodecg

RUN nodecg install jhobz/de-wdg-broadcast && nodecg defaultconfig de-wdg-broadcast
RUN cd bundles/de-wdg-broadcast && npm run build && cd ../..

# COPY --chown=nodecg:nodecg . /opt/nodecg/bundles/de-wdg-broadcast