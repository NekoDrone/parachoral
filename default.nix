{ lib, buildNpmPackage }:

buildNpmPackage {
  pname = "dijiang-app";
  version = "0.0.1";

  src = ./.;

  npmDepsHash = lib.fakeHash;

  meta = {
    description = "Alternative frontend client for Tangled";
    homepage = "https://tangled.org/isuggest.selfce.st/strand";
    license = lib.licenses.mit;
    maintainers = with lib.maintainers; [ ];
    mainProgram = "example";
  };
}
