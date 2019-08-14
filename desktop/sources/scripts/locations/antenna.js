//  Created by Devine Lu Linvega.
//  Copyright © 2017 XXIIVV. All rights reserved.

class LocationAntenna extends Location {
  constructor (name, system, at, mapRequirement = null) {
    // assertArgs(arguments, 4);
    super(name, system, at, new IconAntenna(), new StructureAntenna())

    this.target = null
    this.shouldAlign = false
    this.orientation = 0

    this.details = '???'
    this.mapRequirement = mapRequirement
  }

  makePanel () {
    // assertArgs(arguments, 0);
    let newPanel = new Panel()

    let requirementLabel = new SceneLabel('Orientation Location$Transmit Access')
    requirementLabel.position.set(Templates.leftMargin, Templates.topMargin - 0.3, 0)
    newPanel.add(requirementLabel)

    this.button = new SceneButton(this, 'orient', 'orient', 2)
    this.button.position.set(0, -1, 0)
    newPanel.add(this.button)

    this.port = new ScenePort(this, this.code)
    this.port.position.set(0, -0.2, 0)
    newPanel.add(this.port)

    this.targetLabel = new SceneLabel('--', 0.1, Alignment.right, verreciel.grey)
    this.targetLabel.position.set(-0.3, 0, 0)
    this.port.add(this.targetLabel)

    this.orientationLabel = new SceneLabel('--', 0.1, Alignment.left, verreciel.grey)
    this.orientationLabel.position.set(0.3, 0, 0)
    this.port.add(this.orientationLabel)

    this.button.disable('orient', verreciel.white)
    this.port.enable()

    return newPanel
  }

  dockUpdate () {
    // assertArgs(arguments, 0);
    super.dockUpdate()

    // Update target coming through the wire
    if (this.port.origin && this.port.origin.event && this.port.origin.event.system) {
      if (!this.target) {
        this.target = this.port.origin.event
        this.refresh()
      } else if (this.target && this.target.name !== this.port.origin.event.name) {
        this.target = this.port.origin.event
        this.refresh()
      }
    } else {
      if (this.target) {
        this.target = null
        this.refresh()
      }
    }

    // Align
    if (this.shouldAlign === true) {
      if (!this.target) { this.shouldAlign = false; return }
      const angle = angleBetweenTwoPoints(this.target.at, this.at)
      const offset = angle - this.orientation
      this.orientation += offset * 0.01
      this.orientation = this.orientation % 360
      this.orientationLabel.updateText(parseInt(this.orientation), verreciel.cyan)
      if (parseInt(this.orientation) === parseInt(angle)) {
        this.shouldAlign = false
        this.button.disable('aligned', verreciel.white)
        this.orientationLabel.updateText(parseInt(this.orientation), verreciel.grey)
        this.targetLabel.updateText(parseInt(angle), verreciel.grey)
      }
    }
  }

  refresh () {
    super.refresh()
    if (this.target) {
      const angle = angleBetweenTwoPoints(this.target.at, this.at)
      this.targetLabel.updateText(parseInt(angle), verreciel.cyan)
      this.button.enable('orient', parseInt(this.orientation) === parseInt(angle) ? verreciel.white : verreciel.cyan)
    } else {
      this.targetLabel.updateText('--', verreciel.grey)
      this.button.disable('orient', verreciel.white)
    }
  }

  touch (id) {
    // assertArgs(arguments, 1);
    if (id === 2) {
      this.shouldAlign = true
    } else {
      super.touch(id)
    }
    return true
  }
}

class IconAntenna extends Icon {
  constructor () {
    // assertArgs(arguments, 0);
    super()

    this.mesh.add(
      new SceneLine(
        [
          new THREE.Vector3(0, this.size, 0),
          new THREE.Vector3(this.size, 0, 0),
          new THREE.Vector3(-this.size, 0, 0),
          new THREE.Vector3(0, -this.size, 0),
          new THREE.Vector3(0, this.size, 0),
          new THREE.Vector3(-this.size, 0, 0),
          new THREE.Vector3(this.size, 0, 0),
          new THREE.Vector3(0, -this.size, 0),

          new THREE.Vector3(-this.size * 0.5, -this.size * 0.5, 0),
          new THREE.Vector3(this.size * 0.5, this.size * 0.5, 0),
          new THREE.Vector3(this.size * 0.5, -this.size * 0.5, 0),
          new THREE.Vector3(-this.size * 0.5, this.size * 0.5, 0)
        ],
        this.color
      )
    )
  }
}

class StructureAntenna extends Structure {
  constructor () {
    // assertArgs(arguments, 0);
    super()

    this.root.position.set(0, 0, 0)

    let node = new Empty()
    let ring = new Empty()
    let color = verreciel.grey
    let nodes = 24
    var i = 0
    while (i < nodes) {
      let node2 = new Empty()
      const distance = 2.5
      const length = 0.35
      node2.rotation.y = degToRad(i * (360 / nodes))
      node2.add(new SceneLine([new THREE.Vector3(length, 2, distance), new THREE.Vector3(-length, 2, distance)], verreciel.white))
      ring.add(node2)
      i += 1
    }
    ring.position.set(3, 0, 0)
    ring.rotation.z = degToRad(90)

    node.add(ring)
    node.position.set(0, 5, 0)

    let rect1 = new Rect({ width: 1, height: 1 }, verreciel.grey)
    rect1.rotation.z = degToRad(90)
    rect1.position.set(3, 0, 0)
    rect1.rotation.x = degToRad(45)
    node.add(rect1)

    let rect2 = new Rect({ width: 0.25, height: 0.25 }, verreciel.white)
    rect2.rotation.z = degToRad(90)
    rect2.rotation.x = degToRad(45)
    rect2.position.set(3, 0, 0)
    node.add(rect2)

    let rect3 = new Rect({ width: 0.25, height: 0.25 }, verreciel.grey)
    rect3.rotation.z = degToRad(90)
    rect3.rotation.x = degToRad(45)
    rect3.position.set(3.5, 0, 0)
    node.add(rect3)

    node.add(new SceneLine([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(0, -0.1, 0),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0, 0, -0.1),
      new THREE.Vector3(0, 0, 0.1)
    ], verreciel.white))

    node.add(new SceneLine([
      new THREE.Vector3(2, 0, 0),
      new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(0, -0.5, -0.5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.5, 0.5)
    ], verreciel.grey))

    node.add(new SceneLine([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-8, 0, 0),
      new THREE.Vector3(-16, 0, 0)
    ], verreciel.cyan))

    this.root.add(node)
  }

  sightUpdate () {
    // assertArgs(arguments, 0);
    this.root.rotation.y = degToRad(this.host.orientation / 2)
    this.root.rotation.x = degToRad(this.host.orientation / 3)
    this.root.rotation.z = degToRad(this.host.orientation / 6)

    this.root.children[0].rotation.x += 0.005
  }
}