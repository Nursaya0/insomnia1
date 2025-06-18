let organizationId = null;

function setOrganizationId(id) {
  organizationId = id;
}

function getOrganizationId() {
  return organizationId;
}

module.exports = {
  setOrganizationId,
  getOrganizationId,
};
