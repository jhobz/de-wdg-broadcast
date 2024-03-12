FROM ghcr.io/nodecg/nodecg:latest

USER nodecg

# RUN nodecg install jhobz/de-wdg-broadcast && nodecg defaultconfig de-wdg-broadcast
# RUN cd bundles/de-wdg-broadcast && npm run build && cd ../..

WORKDIR /opt/nodecg/bundles/de-wdg-broadcast

COPY package.json package-lock.json ./
COPY scripts ./scripts

RUN npm ci --omit=dev
RUN npm run build

COPY --chown=nodecg:nodecg --from=build . /opt/nodecg/bundles/de-wdg-broadcast
# COPY --chown=nodecg:nodecg --from=build ./dashboard /opt/nodecg/bundles/de-wdg-broadcast/dashboard
# COPY --chown=nodecg:nodecg --from=build ./extension /opt/nodecg/bundles/de-wdg-broadcast/extension
# COPY --chown=nodecg:nodecg --from=build ./graphics /opt/nodecg/bundles/de-wdg-broadcast/graphics