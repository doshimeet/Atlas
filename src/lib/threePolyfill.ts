import * as THREE from "three";

if (typeof window !== "undefined") {
  const threeAny = THREE as Record<string, any>;
  if (!threeAny["TubeBufferGeometry"] && threeAny["TubeGeometry"]) {
    threeAny["TubeBufferGeometry"] = threeAny["TubeGeometry"];
  }
  if (!threeAny["CylinderBufferGeometry"] && threeAny["CylinderGeometry"]) {
    threeAny["CylinderBufferGeometry"] = threeAny["CylinderGeometry"];
  }
  if (!threeAny["SphereBufferGeometry"] && threeAny["SphereGeometry"]) {
    threeAny["SphereBufferGeometry"] = threeAny["SphereGeometry"];
  }
  if (!threeAny["PlaneBufferGeometry"] && threeAny["PlaneGeometry"]) {
    threeAny["PlaneBufferGeometry"] = threeAny["PlaneGeometry"];
  }
}
