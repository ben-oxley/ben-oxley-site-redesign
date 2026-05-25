---
title: "Meshtastic: Off-Grid Mesh Communication — Use Cases and Limitations"
date: 2026-05-25
description: "A look at Meshtastic — LoRa-based mesh messaging for off-grid communication, where it excels, and where it falls short."
tags: ["meshtastic", "off-grid", "radio", "lora", "mesh-networking", "communication"]
---

Meshtastic is an open-source, LoRA-based mesh networking platform that lets you send text messages and GPS coordinates between devices without any cellular coverage or internet connection. It's built around small, low-power radios that relay messages across a mesh — each node forwards data for its neighbours, so the network can stretch far beyond the range of a single device.

This is a placeholder — I'll flesh it out properly once I've had more hands-on time with the hardware and real-world deployments.

## What Meshtastic Is Good At

- **Off-grid text messaging** — the core use case. If you're hiking, camping, or in a disaster zone with no cell signal, Meshtastic lets you stay in touch with your group over many kilometres.
- **GPS position sharing** — every node can broadcast its location. Useful for group coordination, finding people, or tracking assets without any infrastructure.
- **Low power** — a single ESP32-based node runs for days on a small battery. Set it up and forget about it.
- **Decentralised** — no servers, no SIM cards, no monthly fees. The mesh is the network.
- **Open source** — hardware designs, firmware, and apps are all open. You can build your own nodes, flash custom firmware, and extend the platform.
- **Good range with line of sight** — a node on a hilltop can reach 10+ km to another node. In urban environments it's much less (a few blocks) but still useful.

## What Meshtastic Is Not Good At

- **High bandwidth** — LoRA is slow. You're getting ~30 bytes per second at best. No images, no voice, no web browsing. Text only.
- **Reliable delivery** — the mesh is best-effort. Messages can be lost if the network is congested, nodes are too far apart, or the route is broken. Don't rely on it for anything time-critical.
- **Large groups** — as the mesh grows, every node has to relay more traffic. Beyond ~50 nodes in a dense area, congestion becomes a real problem.
- **Long-term unattended operation** — while battery life is good, nodes do need charging. In a real emergency scenario without power, you're on a timer.
- **Encryption** — Meshtastic has built-in encryption, but it's worth understanding the threat model. It's fine for keeping casual snoopers out, not for operational security against a determined adversary.
- **Not a replacement for satellite communicators** — if you need guaranteed delivery (e.g. sending an SOS from anywhere on Earth), a dedicated satellite messenger like a Garmin inReach or ZOLEO is the right tool. Meshtastic is a complementary tool, not a replacement.

## Compared to MeshCore

[MeshCore](https://meshcore.net/) is another LoRa-based mesh project, but it takes a different architectural approach. Where Meshtastic presents a built-in application layer (chat, positions, telemetry), MeshCore focuses on being a **transport layer** — it creates an IP-over-LoRa tunnel that any application can use. This means you can theoretically run SSH, HTTP, or any IP-based protocol over a MeshCore mesh, albeit at LoRa speeds.

**Key differences:**

| | Meshtastic | MeshCore |
|---|---|---|
| **Focus** | Application-ready (chat, GPS, telemetry) | Generic IP transport layer |
| **Ease of use** | Plug and play — flash and go | More DIY — needs additional tooling on top |
| **Flexibility** | Limited to built-in app features | Any IP-based app can theoretically work |
| **Maturity** | Larger community, more nodes deployed | Newer, smaller ecosystem |
| **Bandwidth** | Both limited by LoRa — ~30 B/s either way |

For most off-grid use cases, Meshtastic's out-of-the-box experience wins. MeshCore is interesting if you want to build custom applications on top of a LoRa mesh rather than just using the built-in messaging.

## Compared to Briar

[Briar](https://briarproject.org/) is a completely different approach. It's an Android app for peer-to-peer encrypted messaging that works over **Bluetooth, Wi-Fi direct, or Tor** — not LoRa. It does have mesh-like properties: messages sync directly between devices within range and propagate through the network, but it's constrained by the range of Bluetooth/Wi-Fi (~10-100m) rather than kilometres of LoRa.

**Key differences:**

| | Meshtastic | Briar |
|---|---|---|
| **Radio layer** | LoRa (868/915 MHz) — km range | Bluetooth / Wi-Fi — metres range |
| **Hardware** | Dedicated radio node + phone/PC | Phone only (Android app) |
| **Encryption** | Built-in AES | End-to-end encrypted by design |
| **Off-grid** | Yes — no infrastructure needed | Yes, but short range limits practicality |
| **Bandwidth** | ~30 B/s | Much higher (Wi-Fi speeds) |
| **Use case** | Wilderness, disaster zones, distributed groups | Urban protests, activist comms, local meetups |

Briar's strength is that it runs on a phone you already carry — no extra hardware. Its weakness is range: you need to be within Bluetooth or Wi-Fi distance of someone to sync. Meshtastic covers the long-range gap that Briar can't, but they're complementary rather than competing.

## The Gap: What a True Decentralised Internet Looks Like

Neither Meshtastic, MeshCore, nor Briar gets us to a proper decentralised internet. Here's what's still missing:

- **Bandwidth** — LoRa's ~30 B/s is enough for text, nothing more. A decentralised internet needs usable throughput for web pages, images, video, and interactive applications. Even basic web browsing over LoRa would be painfully unusable.
- **Reliability** — current mesh protocols are best-effort. A real internet replacement needs guaranteed delivery, congestion control, and quality of service — things TCP/IP provides over infrastructure but mesh networks haven't solved at scale.
- **Addressing and routing at scale** — Meshtastic works for dozens of nodes. Scaling to thousands or millions of nodes in a decentralised mesh is an unsolved problem. How do you find a node three hops away without flooding the entire network? DNS, BGP, and their equivalents don't exist for ad-hoc meshes.
- **Interoperability** — every mesh project speaks its own protocol. A Meshtastic node can't talk to a MeshCore node. A Briar user can't reach someone on Meshtastic. A decentralised internet needs open standards that bridge these islands — the equivalent of TCP/IP for the radio layer.
- **Power** — LoRa nodes run for days, not years. Solar can extend that, but powering a radio that's always listening for relays is fundamentally different from today's internet infrastructure where devices aren't energy-limited.
- **Regulation** — LoRa operates in ISM bands that are licence-free but have duty cycle limits (typically 1% or less in most countries). You physically can't transmit enough data to replace an internet connection over these bands. Higher frequencies have more bandwidth but worse range and need line of sight.

The ideal decentralised internet probably isn't one technology — it's a **layered stack**: LoRa for long-range low-bandwidth signalling, Wi-Fi mesh for local high-bandwidth, satellite for guaranteed global coverage, with common addressing and routing protocols bridging them all. We're a long way from that existing as a cohesive system anyone can deploy.

## Bottom Line

Meshtastic fills a specific niche: low-cost, off-grid, text-based mesh communication for groups in areas without cellular coverage. It's excellent for hiking, emergency preparedness, and distributed event coordination. It's not a general-purpose communication tool — if you need bandwidth, reliability, or guaranteed coverage, traditional infrastructure or satellite devices are still necessary.

More details once I've tested this properly in the field.