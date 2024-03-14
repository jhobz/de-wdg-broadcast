## BUILD
FROM ghcr.io/nodecg/nodecg:latest

COPY --chown=nodecg:nodecg package.json /opt/nodecg/bundles/de-wdg-broadcast/package.json

# Make sure you build your project! Either build before your docker build step, or in this file before this point.
COPY --chown=nodecg:nodecg node_modules /opt/nodecg/bundles/de-wdg-broadcast/node_modules
COPY --chown=nodecg:nodecg dashboard /opt/nodecg/bundles/de-wdg-broadcast/dashboard
COPY --chown=nodecg:nodecg extension /opt/nodecg/bundles/de-wdg-broadcast/extension
COPY --chown=nodecg:nodecg graphics /opt/nodecg/bundles/de-wdg-broadcast/graphics